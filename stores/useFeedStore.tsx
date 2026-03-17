"use client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import {
    collection,
    collectionGroup,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    getDocs,
    Query,
    documentId,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/firebase";
import type { IPost } from "@/interfaces/interfaces";

const DEFAULT_PAGE_SIZE = 10;

type FeedKey = "all" | "liked" | "following" | "user";

interface FeedState {
    items: IPost[];
    loading: boolean;
    hasMore: boolean;
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    likesCursor: QueryDocumentSnapshot<DocumentData> | null;
    lastTimestamp: number | null;
    inFlight: boolean;
    pageSize: number;
    targetUid?: string | null;
}

interface FeedStore {
    feeds: Record<FeedKey, FeedState>;
    followingIds: string[] | null;

    initFeed: (key: FeedKey, pageSize?: number) => void;
    fetchNext: (key: FeedKey, targetUid?: string) => Promise<void>;
    refreshFeed: (key: FeedKey) => Promise<void>;
    clearFeed: (key: FeedKey) => void;

    addOrUpdatePost: (post: IPost) => void;
    removePost: (postId: string) => void;

    setFollowingIds: (ids: string[]) => void;

    updatePostLikes: (postId: string, delta: number) => void;

    clearAll: () => void;
}

function chunkArray<T>(arr: T[], size = 10) {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

const makeEmptyFeed = (pageSize = DEFAULT_PAGE_SIZE): FeedState => ({
    items: [],
    loading: false,
    hasMore: true,
    lastDoc: null,
    likesCursor: null,
    lastTimestamp: null,
    inFlight: false,
    pageSize,
});

export const useFeedStore = create<FeedStore>()(
    devtools<FeedStore>((set, get) => ({
        feeds: {
            all: makeEmptyFeed(),
            liked: makeEmptyFeed(),
            following: makeEmptyFeed(),
            user: makeEmptyFeed(),
        },
        followingIds: null,

        initFeed: (key: FeedKey, pageSize = DEFAULT_PAGE_SIZE) =>
            set((state) => ({
                feeds: { ...state.feeds, [key]: makeEmptyFeed(pageSize) },
            })),

        fetchNext: async (key: FeedKey, targetUid?: string) => {
            const state = get();
            const feed = state.feeds[key];
            if (!feed) return;
            if (feed.inFlight || !feed.hasMore) return;
            set((s) => ({
                feeds: {
                    ...s.feeds,
                    [key]: {
                        ...s.feeds[key],
                        inFlight: true,
                        loading: true,
                        targetUid,
                    },
                },
            }));

            try {
                if (key === "all") {
                    const postsRef = collection(db, "posts");
                    const q = feed.lastDoc
                        ? query(
                              postsRef,
                              orderBy("createdAt", "desc"),
                              startAfter(feed.lastDoc),
                              limit(feed.pageSize),
                          )
                        : query(
                              postsRef,
                              orderBy("createdAt", "desc"),
                              limit(feed.pageSize),
                          );

                    const snap = await getDocs(q as Query<DocumentData>);
                    if (snap.empty) {
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: { ...s.feeds[key], hasMore: false },
                            },
                        }));
                    } else {
                        const newPosts = snap.docs.map(
                            (d) =>
                                ({
                                    id: d.id,
                                    ...d.data(),
                                }) as IPost,
                        );
                        mergePostsIntoFeed(key, newPosts);
                        const last = snap.docs[snap.docs.length - 1];
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: {
                                    ...s.feeds[key],
                                    lastDoc: last,
                                    hasMore: snap.size >= feed.pageSize,
                                },
                            },
                        }));
                    }
                } else if (key === "liked") {
                    const uid =
                        get().feeds[key].targetUid ?? auth.currentUser?.uid;
                    if (!uid) {
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: { ...s.feeds[key], hasMore: false },
                            },
                        }));
                        return;
                    }

                    const likesColl = collectionGroup(db, "likes");
                    const q = feed.likesCursor
                        ? query(
                              likesColl,
                              where("userId", "==", uid),
                              orderBy("createdAt", "desc"),
                              startAfter(feed.likesCursor),
                              limit(feed.pageSize),
                          )
                        : query(
                              likesColl,
                              where("userId", "==", uid),
                              orderBy("createdAt", "desc"),
                              limit(feed.pageSize),
                          );

                    const likesSnap = await getDocs(q as Query<DocumentData>);
                    if (likesSnap.empty) {
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: { ...s.feeds[key], hasMore: false },
                            },
                        }));
                    } else {
                        const postIds = likesSnap.docs
                            .map((d) => d.ref.parent.parent?.id)
                            .filter(Boolean) as string[];
                        const chunks = chunkArray(postIds, 10);
                        const fetched: IPost[] = [];
                        for (const ch of chunks) {
                            const postsRef = collection(db, "posts");
                            const qPosts = query(
                                postsRef,
                                where(documentId(), "in", ch),
                            );
                            const snapPosts = await getDocs(
                                qPosts as Query<DocumentData>,
                            );
                            snapPosts.forEach((p) =>
                                fetched.push({
                                    id: p.id,
                                    ...p.data(),
                                } as IPost),
                            );
                        }
                        fetched.sort(
                            (a, b) =>
                                (b.createdAt as number) -
                                (a.createdAt as number),
                        );
                        mergePostsIntoFeed(key, fetched);
                        const last = likesSnap.docs[likesSnap.docs.length - 1];
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: {
                                    ...s.feeds[key],
                                    likesCursor: last,
                                    hasMore: likesSnap.size >= feed.pageSize,
                                },
                            },
                        }));
                    }
                } else if (key === "following") {
                    const uid = auth.currentUser?.uid;
                    if (!uid) {
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: { ...s.feeds[key], hasMore: false },
                            },
                        }));
                        return;
                    }

                    if (!get().followingIds) {
                        const fSnap = await getDocs(
                            collection(db, "users", uid, "following"),
                        );
                        const ids = fSnap.empty
                            ? []
                            : fSnap.docs.map((d) => d.id);
                        set(() => ({ followingIds: ids }));
                    }

                    const followingIds = get().followingIds || [];
                    if (followingIds.length === 0) {
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: { ...s.feeds[key], hasMore: false },
                            },
                        }));
                        return;
                    }

                    const lastTimestamp = feed.lastTimestamp ?? Date.now();
                    const chunks = chunkArray(followingIds, 10);
                    const candidates: IPost[] = [];

                    for (const ch of chunks) {
                        const postsRef = collection(db, "posts");
                        const qPosts = query(
                            postsRef,
                            where("authorId", "in", ch),
                            where("createdAt", "<", lastTimestamp),
                            orderBy("createdAt", "desc"),
                            limit(feed.pageSize),
                        );
                        const snapPosts = await getDocs(
                            qPosts as Query<DocumentData>,
                        );
                        snapPosts.forEach((p) =>
                            candidates.push({
                                id: p.id,
                                ...p.data(),
                            } as IPost),
                        );
                    }

                    candidates.sort(
                        (a, b) =>
                            (b.createdAt as number) - (a.createdAt as number),
                    );
                    const page = candidates.slice(0, feed.pageSize);
                    if (page.length === 0) {
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: { ...s.feeds[key], hasMore: false },
                            },
                        }));
                    } else {
                        mergePostsIntoFeed(key, page);
                        const newLast = page[page.length - 1]
                            .createdAt as number;
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: {
                                    ...s.feeds[key],
                                    lastTimestamp: newLast,
                                    hasMore: page.length >= feed.pageSize,
                                },
                            },
                        }));
                    }
                } else if (key === "user") {
                    const uid =
                        get().feeds[key].targetUid ?? auth.currentUser?.uid;
                    if (!uid) {
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: { ...s.feeds[key], hasMore: false },
                            },
                        }));
                        return;
                    }
                    const postsRef = collection(db, "posts");
                    const q = feed.lastDoc
                        ? query(
                              postsRef,
                              where("authorId", "==", uid),
                              orderBy("createdAt", "desc"),
                              startAfter(feed.lastDoc),
                              limit(feed.pageSize),
                          )
                        : query(
                              postsRef,
                              where("authorId", "==", uid),
                              orderBy("createdAt", "desc"),
                              limit(feed.pageSize),
                          );

                    const snap = await getDocs(q as Query<DocumentData>);
                    if (snap.empty) {
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: { ...s.feeds[key], hasMore: false },
                            },
                        }));
                    } else {
                        const newPosts = snap.docs.map(
                            (d) =>
                                ({
                                    id: d.id,
                                    ...d.data(),
                                }) as IPost,
                        );
                        mergePostsIntoFeed(key, newPosts);
                        const last = snap.docs[snap.docs.length - 1];
                        set((s) => ({
                            feeds: {
                                ...s.feeds,
                                [key]: {
                                    ...s.feeds[key],
                                    lastDoc: last,
                                    hasMore: snap.size >= feed.pageSize,
                                },
                            },
                        }));
                    }
                }
            } catch (err) {
                console.error("fetchNext error:", err);
                set((s) => ({
                    feeds: {
                        ...s.feeds,
                        [key]: {
                            ...s.feeds[key],
                            hasMore: false,
                        },
                    },
                }));
            } finally {
                set((s) => ({
                    feeds: {
                        ...s.feeds,
                        [key]: {
                            ...s.feeds[key],
                            inFlight: false,
                            loading: false,
                        },
                    },
                }));
            }
        },

        refreshFeed: async (key: FeedKey) => {
            set((s) => ({
                feeds: {
                    ...s.feeds,
                    [key]: makeEmptyFeed(s.feeds[key].pageSize),
                },
            }));
            await get().fetchNext(key);
        },

        clearFeed: (key: FeedKey) => {
            set((s) => ({
                feeds: {
                    ...s.feeds,
                    [key]: makeEmptyFeed(s.feeds[key].pageSize),
                },
            }));
        },

        addOrUpdatePost: (post: IPost) => {
            set((s) => {
                const feeds = { ...s.feeds };
                const upsert = (fKey: FeedKey) => {
                    const arr = [...feeds[fKey].items];
                    const idx = arr.findIndex((p) => p.id === post.id);
                    if (idx >= 0) arr[idx] = { ...arr[idx], ...post };
                    else arr.unshift(post);
                    const map = new Map(arr.map((p) => [p.id, p]));
                    const merged = Array.from(map.values()).sort(
                        (a, b) =>
                            (b.createdAt as number) - (a.createdAt as number),
                    );
                    feeds[fKey].items = merged;
                };
                upsert("all");
                if (s.followingIds?.includes(post.authorId))
                    upsert("following");
                return { feeds };
            });
        },

        removePost: (postId: string) => {
            set((s) => {
                const feeds = { ...s.feeds };
                (Object.keys(feeds) as FeedKey[]).forEach((k) => {
                    feeds[k].items = feeds[k].items.filter(
                        (p) => p.id !== postId,
                    );
                });
                return { feeds };
            });
        },

        setFollowingIds: (ids: string[]) => set(() => ({ followingIds: ids })),

        updatePostLikes: (postId: string, delta: number) => {
            set((s) => {
                const feeds = { ...s.feeds };
                (Object.keys(feeds) as FeedKey[]).forEach((k) => {
                    feeds[k].items = feeds[k].items.map((p) =>
                        p.id === postId
                            ? {
                                  ...p,
                                  likesCount: Math.max(
                                      0,
                                      (p.likesCount || 0) + delta,
                                  ),
                              }
                            : p,
                    );
                });
                return { feeds };
            });
        },

        clearAll: () => {
            set(() => ({
                feeds: {
                    all: makeEmptyFeed(),
                    liked: makeEmptyFeed(),
                    following: makeEmptyFeed(),
                    user: makeEmptyFeed(),
                },
                followingIds: null,
            }));
        },
    })),
);

function mergePostsIntoFeed(key: FeedKey, newPosts: IPost[]) {
    useFeedStore.setState((s) => {
        const old = s.feeds[key].items || [];
        const map = new Map<string, IPost>();
        [...newPosts, ...old].forEach((p) => {
            map.set(p.id, p);
        });
        const merged = Array.from(map.values()).sort(
            (a, b) => (b.createdAt as number) - (a.createdAt as number),
        );
        return {
            feeds: { ...s.feeds, [key]: { ...s.feeds[key], items: merged } },
        };
    });
}
