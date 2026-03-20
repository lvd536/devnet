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
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    runTransaction,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { getUserBase } from "@/consts/user";

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

            const newUser = getUserBase(
                chosenUsername,
                user.photoURL ?? null,
                githubLogin ?? user.photoURL ?? null,
            );

            tx.set(userRef, newUser);
        });
    }
    return { isFirstAuth, uid: user.uid, githubLogin };
}

async function fetchGithubRepos(
    accessToken: string,
    existingRepoIds?: Set<number>,
): Promise<IGitHubRepo[]> {
    const allRepos: IGitHubRepo[] = [];
    let page = 1;

    while (true) {
        const res = await fetch(
            `https://api.github.com/user/repos?per_page=50&sort=updated&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/vnd.github+json",
                },
            },
        );

        if (!res.ok) throw new Error("Failed to fetch repos");

        const repos: IGitHubRepo[] = await res.json();
        if (repos.length === 0) break;

        if (existingRepoIds) {
            const newOnPage = repos.filter((r) => !existingRepoIds.has(r.id));
            allRepos.push(...newOnPage);
            if (newOnPage.length === 0) break;
        } else {
            allRepos.push(...repos);
            break;
        }

        page++;
    }

    return allRepos;
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

        if (!token) throw new Error("No access token");

        const uid = auth.currentUser!.uid;

        const snap = await getDocs(
            query(collection(db, "projects"), where("ownerId", "==", uid)),
        );
        const existingRepoIds = new Set<number>(
            snap.docs.map((d) => d.data().repoId as number),
        );

        await updateDoc(doc(db, "users", uid), {
            avatarUrl: auth.currentUser!.photoURL ?? null,
        });

        const newRepos = await fetchGithubRepos(token, existingRepoIds);
        if (newRepos.length > 0) {
            await saveReposToFirestore(uid, newRepos);
        }

        return newRepos.length;
    } catch (err) {
        console.error(err);
        return 0;
    }
}
