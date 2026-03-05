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
    limit,
    orderBy,
    documentId,
    collectionGroup,
    or,
    startAfter,
    DocumentSnapshot,
    QuerySnapshot,
    increment,
    deleteDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
    IComment,
    IFollower,
    IFollowing,
    IGitHubRepo,
    ILike,
    IPost,
    IProject,
    IRole,
    IUserProfile,
    IUserSummary,
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
                },
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
        { id: userSnap.id, ...userSnap.data() } as IUserProfile,
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
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const userRef = doc(db, "users", user.uid);
    const postRef = doc(collection(db, "posts"));
    const post = {
        authorId: auth.currentUser!.uid,
        content,
        projectId: projectId ?? null,
        likesCount: 0,
        commentsCount: 0,
        createdAt: Date.now(),
    };
    await runTransaction(db, async (tx) => {
        const userSnap = await tx.get(userRef);

        if (!userSnap.exists()) {
            throw new Error("User does not exist");
        }

        tx.set(postRef, post);
        tx.update(userRef, {
            "stats.postsCount": increment(1),
        });
    });
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

export async function getPost(postId: string) {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists) return undefined;
    return { id: postSnap.id, ...postSnap.data() } as IPost;
}

export async function addLike(postId: string, userId: string) {
    try {
        const userRef = doc(db, "users", userId);
        const postRef = doc(db, "posts", postId);
        const likeRef = doc(db, "posts", postId, "likes", userId);

        await runTransaction(db, async (tx) => {
            const [userSnap, postSnap, likeSnap] = await Promise.all([
                await tx.get(userRef),
                await tx.get(postRef),
                await tx.get(likeRef),
            ]);
            if (!userSnap.exists()) throw new Error("User does not exist");
            if (!postSnap.exists()) throw new Error("Post does not exist");
            if (likeSnap.exists()) throw new Error("Like exists");

            const postCreatorId = (postSnap.data() as IPost).authorId;
            const postCreatorRef = doc(db, "users", postCreatorId);
            const postCreatorSnap = await tx.get(postCreatorRef);
            if (!postCreatorSnap.exists())
                throw new Error("Post creator not exists");

            tx.set(likeRef, {
                createdAt: serverTimestamp(),
                userId,
            });

            const currentLikes = (postSnap.data()?.likesCount as number) || 0;
            tx.update(postRef, {
                likesCount: currentLikes + 1,
            });
            tx.update(userRef, {
                "stats.likesGiven": increment(1),
            });
            tx.update(postCreatorRef, {
                "stats.likesReceived": increment(1),
            });
        });
    } catch (err) {
        console.error("addLike error:", err);
    }
}

export async function deleteLike(postId: string, userId: string) {
    try {
        const userRef = doc(db, "users", userId);
        const postRef = doc(db, "posts", postId);
        const likeRef = doc(db, "posts", postId, "likes", userId);

        await runTransaction(db, async (tx) => {
            const [userSnap, postSnap, likeSnap] = await Promise.all([
                await tx.get(userRef),
                await tx.get(postRef),
                await tx.get(likeRef),
            ]);
            if (!userSnap.exists()) throw new Error("User does not exist");
            if (!postSnap.exists()) throw new Error("Post does not exist");
            if (!likeSnap.exists()) throw new Error("Like exists");

            const postCreatorId = (postSnap.data() as IPost).authorId;
            const postCreatorRef = doc(db, "users", postCreatorId);
            const postCreatorSnap = await tx.get(postCreatorRef);
            if (!postCreatorSnap.exists())
                throw new Error("Post creator not exists");

            tx.delete(likeRef);

            const currentLikes = (postSnap.data()?.likesCount as number) || 0;
            tx.update(postRef, {
                likesCount: currentLikes > 0 ? currentLikes - 1 : 0,
            });
            tx.update(userRef, {
                "stats.likesGiven":
                    (userSnap.data() as IUserProfile).stats.likesGiven > 0
                        ? increment(-1)
                        : 0,
            });
            tx.update(postCreatorRef, {
                "stats.likesReceived": (postCreatorSnap.data() as IUserProfile)
                    .stats.likesReceived
                    ? increment(-1)
                    : 0,
            });
        });
    } catch (err) {
        console.error("deleteLike error:", err);
    }
}

export async function getLikes(postId: string) {
    const likesSnapshot = await getDocs(
        collection(db, "posts", postId, "likes"),
    );
    return likesSnapshot.empty
        ? undefined
        : (likesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          })) as ILike[]);
}

export async function getIsLiked(postId: string, userId: string) {
    try {
        const likeSnap = await getDoc(
            doc(db, "posts", postId, "likes", userId),
        );
        if (likeSnap.exists()) return true;
        else return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function addComment(
    userId: string,
    postId: string,
    message: string,
) {
    try {
        const userRef = doc(db, "users", userId);
        const postRef = doc(db, "posts", postId);
        const commentsCol = collection(db, "posts", postId, "comments");
        const commentRef = doc(commentsCol);

        await runTransaction(db, async (tx) => {
            const [userSnap, postSnap] = await Promise.all([
                await tx.get(userRef),
                await tx.get(postRef),
            ]);

            if (!userSnap.exists()) throw new Error("User does not exist");
            if (!postSnap.exists()) throw new Error("Post does not exist");

            tx.set(commentRef, {
                authorId: userId,
                content: message,
                createdAt: serverTimestamp(),
            });

            const currentComments =
                (postSnap.data()?.commentsCount as number) || 0;

            tx.update(postRef, {
                commentsCount: currentComments + 1,
            });

            tx.update(userRef, {
                "stats.commentsCount": increment(1),
            });
        });
    } catch (err) {
        console.error("addComment error:", err);
    }
}

export async function deleteComment(postId: string, commentId: string) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Not authenticated");

        const userRef = doc(db, "users", user.uid);
        const postRef = doc(db, "posts", postId);
        const commentRef = doc(db, "posts", postId, "comments", commentId);

        await runTransaction(db, async (tx) => {
            const [userSnap, postSnap, commentSnap] = await Promise.all([
                await tx.get(userRef),
                await tx.get(postRef),
                await tx.get(commentRef),
            ]);

            if (!userSnap.exists()) throw new Error("User does not exist");
            if (!postSnap.exists()) throw new Error("Post does not exist");
            if (!commentSnap.exists())
                throw new Error("Comment does not exist");

            tx.delete(commentRef);

            const currentComments =
                (postSnap.data()?.commentsCount as number) || 0;

            tx.update(postRef, {
                commentsCount: currentComments > 0 ? currentComments - 1 : 0,
            });

            tx.update(userRef, {
                "stats.commentsCount":
                    (userSnap.data() as IUserProfile).stats.commentsCount > 0
                        ? increment(-1)
                        : 0,
            });
        });
    } catch (err) {
        console.error("deleteComment error:", err);
    }
}

export async function getComments(postId: string) {
    const commentSnap = await getDocs(
        collection(db, "posts", postId, "comments"),
    );
    return commentSnap.empty
        ? undefined
        : (commentSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          })) as IComment[]);
}

export async function addFollower(
    targetUserId: string,
    currentUserId: string,
): Promise<boolean> {
    try {
        const targetRef = doc(db, "users", targetUserId);
        const currentRef = doc(db, "users", currentUserId);

        const followerRef = doc(
            db,
            "users",
            targetUserId,
            "followers",
            currentUserId,
        );
        const followingRef = doc(
            db,
            "users",
            currentUserId,
            "following",
            targetUserId,
        );

        await runTransaction(db, async (tx) => {
            const [targetSnap, currentSnap, followerSnap] = await Promise.all([
                tx.get(targetRef),
                tx.get(currentRef),
                tx.get(followerRef),
            ]);

            if (!targetSnap.exists()) {
                throw new Error("Target user does not exist");
            }
            if (!currentSnap.exists()) {
                throw new Error("Current user does not exist");
            }

            if (followerSnap.exists()) {
                return;
            }

            tx.set(followerRef, { createdAt: serverTimestamp() });
            tx.set(followingRef, { createdAt: serverTimestamp() });

            tx.update(targetRef, {
                "stats.followersCount": increment(1),
            });
            tx.update(currentRef, {
                "stats.followingCount": increment(1),
            });
        });

        return true;
    } catch (err) {
        console.error("addFollower error:", err);
        return false;
    }
}

export async function removeFollower(
    targetUserId: string,
    currentUserId: string,
): Promise<boolean> {
    try {
        const targetRef = doc(db, "users", targetUserId);
        const currentRef = doc(db, "users", currentUserId);

        const followerRef = doc(
            db,
            "users",
            targetUserId,
            "followers",
            currentUserId,
        );
        const followingRef = doc(
            db,
            "users",
            currentUserId,
            "following",
            targetUserId,
        );

        await runTransaction(db, async (tx) => {
            const [targetSnap, currentSnap, followerSnap] = await Promise.all([
                tx.get(targetRef),
                tx.get(currentRef),
                tx.get(followerRef),
            ]);

            if (!targetSnap.exists() || !currentSnap.exists()) {
                throw new Error("One of users does not exist");
            }

            if (!followerSnap.exists()) {
                return;
            }

            const targetData = targetSnap.data() as
                | Partial<IUserProfile>
                | undefined;
            const currentData = currentSnap.data() as
                | Partial<IUserProfile>
                | undefined;

            const targetFollowers =
                (targetData?.stats?.followersCount as number) ?? 0;
            const currentFollowing =
                (currentData?.stats?.followingCount as number) ?? 0;

            if (targetFollowers > 0)
                tx.update(targetRef, { "stats.followersCount": increment(-1) });
            if (currentFollowing > 0)
                tx.update(currentRef, {
                    "stats.followingCount": increment(-1),
                });

            tx.delete(followerRef);
            tx.delete(followingRef);
        });

        return true;
    } catch (err) {
        console.error("removeFollower error:", err);
        return false;
    }
}

export async function getFollowers(userId: string) {
    const followers = await getDocs(
        collection(db, "users", userId, "followers"),
    );

    return followers.empty
        ? undefined
        : (followers.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          })) as IFollower[]);
}

export async function getFollowing(userId: string) {
    const following = await getDocs(
        collection(db, "users", userId, "following"),
    );

    return following.empty
        ? undefined
        : (following.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          })) as IFollowing[]);
}

export async function getIsFollower(userId: string, targetUserId: string) {
    try {
        const followerSnap = await getDoc(
            doc(db, "users", targetUserId, "followers", userId),
        );
        if (followerSnap.exists()) return true;
        else return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function getIsFollowing(userId: string, targetUserId: string) {
    try {
        const followingSnap = await getDoc(
            doc(db, "users", targetUserId, "following", userId),
        );
        if (followingSnap.exists()) return true;
        else return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function fetchUsersByIds(
    ids: string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Record<string, any | undefined>> {
    if (!ids || ids.length === 0) return {};

    const CHUNK_SIZE = 10;
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
        chunks.push(ids.slice(i, i + CHUNK_SIZE));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultMap: Record<string, any | undefined> = {};

    for (const chunkIds of chunks) {
        const q = query(
            collection(db, "users"),
            where(documentId(), "in", chunkIds),
        );
        const snap = await getDocs(q);
        snap.docs.forEach((d) => {
            resultMap[d.id] = d.data();
        });

        for (const id of chunkIds) {
            if (!(id in resultMap)) resultMap[id] = undefined;
        }
    }

    return resultMap;
}

export async function getFollowersLimited(
    userId?: string,
    currentUserId?: string,
    pageSize = 20,
): Promise<IUserSummary[] | undefined> {
    if (!userId) {
        console.warn("getFollowersLimited: userId is undefined");
        return undefined;
    }

    try {
        const colRef = collection(db, "users", userId, "followers");

        let snap;
        try {
            const q = query(
                colRef,
                orderBy("createdAt", "desc"),
                limit(pageSize),
            );
            snap = await getDocs(q);
        } catch (err) {
            console.warn(
                "getFollowersLimited: orderBy(createdAt) failed, falling back to unsorted getDocs",
                err,
            );
            snap = await getDocs(colRef);
        }

        if (!snap || snap.empty) return undefined;

        const base = snap.docs.slice(0, pageSize).map((d) => {
            return {
                id: d.id,
                createdAt: d.data().createdAt,
            } as IFollower;
        });

        const ids = base.map((b) => b.id);
        const usersMap = await fetchUsersByIds(ids);

        if (!currentUserId) {
            return base.map((b) => {
                const userDoc = usersMap[b.id];
                return {
                    id: b.id,
                    username: userDoc?.username ?? null,
                    githubUsername: userDoc?.githubUsername ?? null,
                    avatarUrl: userDoc?.avatarUrl ?? null,
                    createdAt: b.createdAt,
                } as IUserSummary;
            });
        }

        const withState = await Promise.all(
            base.map(async (b) => {
                let isFollowing = false;
                try {
                    isFollowing = !!(await getIsFollower(currentUserId, b.id));
                } catch (err) {
                    console.warn(
                        "getFollowersLimited: getIsFollower failed for",
                        b.id,
                        err,
                    );
                    isFollowing = false;
                }
                const userDoc = usersMap[b.id];
                return {
                    id: b.id,
                    username: userDoc?.username ?? null,
                    githubUsername: userDoc?.githubUsername ?? null,
                    avatarUrl: userDoc?.avatarUrl ?? null,
                    createdAt: b.createdAt,
                    isFollowing,
                } as IUserSummary;
            }),
        );

        return withState;
    } catch (err) {
        console.error("getFollowersLimited error:", err);
        return undefined;
    }
}

export async function getFollowingLimited(
    userId?: string,
    currentUserId?: string,
    pageSize = 20,
): Promise<IUserSummary[] | undefined> {
    if (!userId) {
        console.warn("getFollowingLimited: userId is undefined");
        return undefined;
    }

    try {
        const colRef = collection(db, "users", userId, "following");

        let snap;
        try {
            const q = query(
                colRef,
                orderBy("createdAt", "desc"),
                limit(pageSize),
            );
            snap = await getDocs(q);
        } catch (err) {
            console.warn(
                "getFollowingLimited: orderBy(createdAt) failed, falling back to unsorted getDocs",
                err,
            );
            snap = await getDocs(colRef);
        }

        if (!snap || snap.empty) return undefined;

        const base = snap.docs.slice(0, pageSize).map((d) => {
            return {
                id: d.id,
                createdAt: d.data().createdAt,
            } as IFollowing;
        });

        const ids = base.map((b) => b.id);
        const usersMap = await fetchUsersByIds(ids);

        if (!currentUserId) {
            return base.map((b) => {
                const userDoc = usersMap[b.id];
                return {
                    id: b.id,
                    username: userDoc?.username ?? null,
                    githubUsername: userDoc?.githubUsername ?? null,
                    avatarUrl: userDoc?.avatarUrl ?? null,
                    createdAt: b.createdAt,
                } as IUserSummary;
            });
        }

        const withState = await Promise.all(
            base.map(async (b) => {
                let isFollowing = false;
                try {
                    isFollowing = !!(await getIsFollower(currentUserId, b.id));
                } catch (err) {
                    console.warn(
                        "getFollowingLimited: getIsFollower failed for",
                        b.id,
                        err,
                    );
                    isFollowing = false;
                }
                const userDoc = usersMap[b.id];
                return {
                    id: b.id,
                    username: userDoc?.username ?? null,
                    githubUsername: userDoc?.githubUsername ?? null,
                    avatarUrl: userDoc?.avatarUrl ?? null,
                    createdAt: b.createdAt,
                    isFollowing,
                } as IUserSummary;
            }),
        );

        return withState;
    } catch (err) {
        console.error("getFollowingLimited error:", err);
        return undefined;
    }
}

async function getPostsLikedByUser(userId: string) {
    if (!userId) return [];

    const q = query(
        collectionGroup(db, "likes"),
        where("userId", "==", userId),
    );

    const snap = await getDocs(q);

    return snap.docs
        .map((doc) => {
            const postId = doc.ref.parent.parent?.id;
            return postId;
        })
        .filter(Boolean);
}

function isPost(post: IPost | null): post is IPost {
    return post !== null;
}

export async function getLikedPosts(userId: string) {
    const postIds = await getPostsLikedByUser(userId);

    const posts = await Promise.all(
        postIds.map(async (postId) => {
            if (!postId) return null;
            const snap = await getDoc(doc(db, "posts", postId));
            return snap.exists()
                ? ({ id: snap.id, ...snap.data() } as IPost)
                : null;
        }),
    );

    return posts.filter(isPost);
}

export async function getFollowingIds(userId: string) {
    const colRef = collection(db, "users", userId, "following");

    let snap;
    try {
        const q = query(colRef, orderBy("createdAt", "desc"));
        snap = await getDocs(q);
    } catch (err) {
        console.warn(
            "getFollowingLimited: orderBy(createdAt) failed, falling back to unsorted getDocs",
            err,
        );
        snap = await getDocs(colRef);
    }

    if (!snap || snap.empty) return undefined;

    return snap.docs.map((d) => {
        return d.id;
    });
}

export async function searchUsers(
    searchQuery: string,
    pageSize = 20,
    chunkSize = 500,
): Promise<IUserProfile[]> {
    if (!searchQuery) return [];

    const qStr = searchQuery.toLowerCase();
    const usersRef = collection(db, "users");

    let lastDoc: DocumentSnapshot | null = null;
    const found: IUserProfile[] = [];

    while (found.length < pageSize) {
        const q = lastDoc
            ? query(
                  usersRef,
                  orderBy("createdAt"),
                  startAfter(lastDoc),
                  limit(chunkSize),
              )
            : query(usersRef, orderBy("createdAt"), limit(chunkSize));

        const snap: QuerySnapshot = await getDocs(q);

        if (snap.empty) break;

        for (const docSnap of snap.docs) {
            const data = docSnap.data();
            const username = (data.username ?? "").toString().toLowerCase();
            const github = (data.githubUsername ?? "").toString().toLowerCase();

            if (username.includes(qStr) || github.includes(qStr)) {
                found.push({ id: docSnap.id, ...data } as IUserProfile);
                if (found.length >= pageSize) break;
            }
        }

        if (found.length >= pageSize) break;
        if (snap.docs.length < chunkSize) break;

        lastDoc = snap.docs[snap.docs.length - 1];
    }

    return found;
}

export async function getRoles(): Promise<IRole[] | undefined> {
    const rolesRef = collection(db, "roles");
    const rolesSnap = await getDocs(rolesRef);

    if (rolesSnap.empty) return undefined;
    else
        return rolesSnap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as IRole,
        );
}

export async function addRole(role: IRole) {
    try {
        const rolesRef = doc(db, "roles", role.id);
        await setDoc(rolesRef, role);
    } catch (err) {
        console.error(err);
    }
}

export async function deleteRole(roleId: string) {
    try {
        const roleRef = doc(db, "roles", roleId);
        await deleteDoc(roleRef);
    } catch (err) {
        console.error(err);
    }
}
