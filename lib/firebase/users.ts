import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    limit,
    orderBy,
    documentId,
    startAfter,
    DocumentSnapshot,
    QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import {
    IFollower,
    IFollowing,
    IPost,
    IUserBadge,
    IUserBanner,
    IUserProfile,
    IUserSummary,
} from "@/interfaces/interfaces";

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

export async function checkUsernameExists(username: string): Promise<boolean> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const snap = await getDocs(q);
    return !snap.empty;
}

export async function fetchUsersByIds(
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

export async function getUserBadges(userId: string) {
    const badges = await getDocs(collection(db, "users", userId, "badges"));

    return badges.empty
        ? undefined
        : (badges.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          })) as IUserBadge[]);
}

export async function getUserBanners(userId: string) {
    const banners = await getDocs(collection(db, "users", userId, "banners"));

    return banners.empty
        ? undefined
        : (banners.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          })) as IUserBanner[]);
}
