import { IGitHubRepo } from "@/interfaces/interfaces";
import { useUserProfileStore } from "@/stores/useProfileStore";
import { checkUsernameExists } from "@/utils/firebaseFunctions";
import {
    GithubAuthProvider,
    UserCredential,
    signInWithPopup,
    OAuthCredential,
    reauthenticateWithPopup,
} from "firebase/auth";
import {
    doc,
    getDoc,
    runTransaction,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";

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

            const newUser = {
                username: chosenUsername,
                role: {
                    id: "member",
                    name: "Member",
                    color: "green-500",
                    permissions: [],
                    priority: 0,
                    createdAt: 0,
                },
                githubUsername: githubLogin ?? user.photoURL ?? null,
                avatarUrl: user.photoURL ?? null,
                xp: 0,
                level: 0,
                stats: {
                    postsCount: 0,
                    projectsCount: 0,
                    likesReceived: 0,
                    likesGiven: 0,
                    commentsCount: 0,
                    followersCount: 0,
                    followingCount: 0,
                    streakDays: 0,
                    lastActiveDate: serverTimestamp(),
                },
                createdAt: serverTimestamp(),
            };

            tx.set(userRef, newUser);
        });
    }
    return { isFirstAuth, uid: user.uid, githubLogin };
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
