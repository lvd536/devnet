import {
    signInWithPopup,
    GithubAuthProvider,
    OAuthCredential,
    UserCredential,
} from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    runTransaction,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function loginWithGithub(desiredUsername?: string) {
    const provider = new GithubAuthProvider();

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

            tx.set(userRef, {
                username: chosenUsername,
                githubUsername: githubLogin ?? null,
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
            });
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
