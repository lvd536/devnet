import {
    signInWithPopup,
    GithubAuthProvider,
    OAuthCredential,
    UserCredential,
    User,
    reauthenticateWithPopup,
} from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    runTransaction,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
    IGitHubRepo,
    IPost,
    IProject,
    IUserProfile,
} from "@/interfaces/interfaces";
import { setUserData, useUserProfileStore } from "@/stores/useProfileStore";

export async function loginWithGithub(desiredUsername?: string) {
    const provider = new GithubAuthProvider();
    provider.addScope("repo");

    const result: UserCredential = await signInWithPopup(auth, provider);
    const user = result.user;

    const credential: OAuthCredential | null =
        GithubAuthProvider.credentialFromResult(result);

    const accessToken = credential?.accessToken ?? null;

    let githubLogin: string | null = null;
    if (accessToken) {
        try {
            const res = await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/vnd.github+json",
                },
            });
            if (res.ok) {
                const json = await res.json();
                githubLogin = json.login ?? null;
            } else {
                console.warn("GitHub /user returned non-OK:", res.status);
            }

            const repos = await fetchGithubRepos(accessToken);
            if (repos) await saveReposToFirestore(user.uid, repos);
        } catch (err) {
            console.warn("Failed to fetch GitHub user:", err);
        }
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const isFirstAuth = !userSnap.exists();

    if (isFirstAuth) {
        if (desiredUsername) {
            const exists = await checkUsernameExists(desiredUsername);
            if (exists) {
                throw new Error("username_already_taken");
            }
        }
        await runTransaction(db, async (tx) => {
            const snap = await tx.get(userRef);
            if (snap.exists()) return;

            const chosenUsername =
                desiredUsername ?? githubLogin ?? user.displayName ?? user.uid;

            const newUser: IUserProfile = {
                username: chosenUsername,
                githubUsername: githubLogin ?? user.photoURL ?? null,
                avatarUrl: user.photoURL ?? null,
                bio: "",
                xp: 0,
                level: 0,
                followersCount: 0,
                followingCount: 0,
                postsCount: 0,
                projectsCount: 0,
                lastSyncAt: null,
                createdAt: serverTimestamp(),
            };

            tx.set(userRef, newUser);
        });
    }
    return { isFirstAuth, uid: user.uid, githubLogin };
}

export async function checkUsernameExists(username: string): Promise<boolean> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const snap = await getDocs(q);
    return !snap.empty;
}

export async function setupUser(user: User) {
    const userRef = doc(db, "users", user.uid);
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("ownerId", "==", user.uid));

    const [userSnap, projectsSnap] = await Promise.all([
        await getDoc(userRef),
        await getDocs(q),
    ]);

    setUserData(
        user,
        userSnap.data() as IUserProfile,
        projectsSnap.docs.map(
            (proj) =>
                ({
                    id: proj.id,
                    ...proj.data(),
                }) as IProject,
        ),
    );
}

async function fetchGithubRepos(
    accessToken: string,
): Promise<IGitHubRepo[] | undefined> {
    const res = await fetch(
        "https://api.github.com/user/repos?per_page=50&sort=updated",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
        },
    );

    if (!res.ok) {
        throw new Error("Failed to fetch repos");
    }

    return await res.json();
}

async function saveReposToFirestore(userId: string, repos: IGitHubRepo[]) {
    for (const repo of repos) {
        const newRepo = {
            id: `${userId}_${repo.id}`,
            ownerId: userId,
            repoId: repo.id,
            repoName: repo.name,
            description: repo.description,
            githubUrl: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            updatedAt: new Date(repo.updated_at).getTime(),
            createdAt: Date.now(),
        };
        useUserProfileStore.getState().pushRepo(newRepo);
        await setDoc(doc(db, "projects", `${userId}_${repo.id}`), newRepo, {
            merge: true,
        });
    }
}

export async function handleSync() {
    try {
        const provider = new GithubAuthProvider();
        provider.addScope("repo");

        const result = await reauthenticateWithPopup(
            auth.currentUser!,
            provider,
        );

        const credential = GithubAuthProvider.credentialFromResult(result);

        const token = credential?.accessToken;

        const userRef = doc(db, "users", auth.currentUser!.uid);
        updateDoc(userRef, {
            avatarUrl: auth.currentUser!.photoURL ?? null,
        });

        const repos = await fetchGithubRepos(token!);
        if (repos) await saveReposToFirestore(auth.currentUser!.uid, repos);
    } catch (err) {
        console.error(err);
    }
}

export async function sendPost(content?: string, projectId?: string | null) {
    try {
        const post = {
            authorId: auth.currentUser!.uid,
            content,
            projectId: projectId ?? null,
            likesCount: 0,
            commentsCount: 0,
            createdAt: Date.now(),
        };
        await addDoc(collection(db, "posts"), post);
    } catch (err) {
        console.error(err);
    }
}

export async function getProjectData(projectId: string) {
    try {
        const projectRef = doc(db, "projects", projectId);
        const projectSnapshot = await getDoc(projectRef);
        if (projectSnapshot.exists()) {
            const project = {
                id: projectSnapshot.id,
                ...projectSnapshot.data(),
            } as IProject;
            return project;
        }
    } catch (err) {
        console.error(err);
    }
}

export async function getUserData(userId: string) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
            const user = {
                id: userSnapshot.id,
                ...userSnapshot.data(),
            } as IUserProfile;
            return user;
        }
    } catch (err) {
        console.error(err);
    }
}

export async function getPostData(post: IPost) {
    const project = post.projectId
        ? await getProjectData(post.projectId)
        : undefined;
    const user = await getUserData(post.authorId);
    return { project, user };
}

export async function getUserPosts(userId: string) {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("authorId", "==", userId));
    const postsSnap = await getDocs(q);

    if (!postsSnap.empty) {
        return postsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as IPost[];
    }

    return undefined;
}

export async function getAllPosts() {
    const postsRef = collection(db, "posts");
    const postsSnap = await getDocs(postsRef);

    if (!postsSnap.empty) {
        return postsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as IPost[];
    }

    return undefined;
}
