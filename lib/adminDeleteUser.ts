import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

const BATCH_LIMIT = 450;

async function batchDelete(docs: FirebaseFirestore.QueryDocumentSnapshot[]) {
    const batch = adminDb.batch();
    docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
}

async function deleteCollection(query: FirebaseFirestore.Query) {
    while (true) {
        const snapshot = await query.limit(BATCH_LIMIT).get();
        if (snapshot.empty) break;
        await batchDelete(snapshot.docs);
    }
}

async function decrementUserStat(
    userId: string,
    field: "followersCount" | "followingCount",
) {
    const ref = adminDb.doc(`users/${userId}`);
    await adminDb.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stats = (snap.data()?.stats as Record<string, any>) || {};
        const current = (stats[field] as number) ?? 0;
        tx.update(ref, { [`stats.${field}`]: Math.max(0, current - 1) });
    });
}

async function deleteLikesByUser(uid: string) {
    try {
        while (true) {
            const likesSnap = await adminDb
                .collectionGroup("likes")
                .where("userId", "==", uid)
                .limit(BATCH_LIMIT)
                .get();
            if (likesSnap.empty) break;
            const batch = adminDb.batch();
            const postCounts = new Map<string, number>();
            for (const likeDoc of likesSnap.docs) {
                const postRef = likeDoc.ref.parent.parent;
                batch.delete(likeDoc.ref);
                if (postRef) {
                    postCounts.set(
                        postRef.id,
                        (postCounts.get(postRef.id) || 0) + 1,
                    );
                }
            }
            await batch.commit();
            for (const [postId, cnt] of postCounts.entries()) {
                const postRef = adminDb.doc(`posts/${postId}`);
                await adminDb.runTransaction(async (tx) => {
                    const ps = await tx.get(postRef);
                    if (!ps.exists) return;
                    const curr = (ps.data()?.likesCount as number) ?? 0;
                    tx.update(postRef, { likesCount: Math.max(0, curr - cnt) });
                });
            }
        }
        return;
    } catch {
        console.warn(
            "collectionGroup(likes) failed, falling back to per-post scan",
        );
    }

    let lastPostDoc: FirebaseFirestore.QueryDocumentSnapshot | undefined;
    while (true) {
        let postsQuery: FirebaseFirestore.Query = adminDb
            .collection("posts")
            .orderBy("__name__")
            .limit(BATCH_LIMIT);
        if (lastPostDoc) postsQuery = postsQuery.startAfter(lastPostDoc);
        const postsSnap = await postsQuery.get();
        if (postsSnap.empty) break;
        for (const postDoc of postsSnap.docs) {
            const postId = postDoc.id;
            while (true) {
                const likesSnap = await adminDb
                    .collection(`posts/${postId}/likes`)
                    .where("userId", "==", uid)
                    .limit(BATCH_LIMIT)
                    .get();
                if (likesSnap.empty) break;
                const b = adminDb.batch();
                likesSnap.docs.forEach((d) => b.delete(d.ref));
                await b.commit();
                await adminDb.runTransaction(async (tx) => {
                    const postRef = adminDb.doc(`posts/${postId}`);
                    const ps = await tx.get(postRef);
                    if (!ps.exists) return;
                    const curr = (ps.data()?.likesCount as number) ?? 0;
                    tx.update(postRef, {
                        likesCount: Math.max(0, curr - likesSnap.docs.length),
                    });
                });
            }
        }
        lastPostDoc = postsSnap.docs[postsSnap.docs.length - 1];
        if (postsSnap.docs.length < BATCH_LIMIT) break;
    }
}

async function deleteCommentsByAuthor(uid: string) {
    try {
        while (true) {
            const commentsSnap = await adminDb
                .collectionGroup("comments")
                .where("authorId", "==", uid)
                .limit(BATCH_LIMIT)
                .get();
            if (commentsSnap.empty) break;
            const batch = adminDb.batch();
            const postCounts = new Map<string, number>();
            for (const c of commentsSnap.docs) {
                const postRef = c.ref.parent.parent;
                batch.delete(c.ref);
                if (postRef) {
                    postCounts.set(
                        postRef.id,
                        (postCounts.get(postRef.id) || 0) + 1,
                    );
                }
            }
            await batch.commit();
            for (const [postId, cnt] of postCounts.entries()) {
                const postRef = adminDb.doc(`posts/${postId}`);
                await adminDb.runTransaction(async (tx) => {
                    const ps = await tx.get(postRef);
                    if (!ps.exists) return;
                    const curr = (ps.data()?.commentsCount as number) ?? 0;
                    tx.update(postRef, {
                        commentsCount: Math.max(0, curr - cnt),
                    });
                });
            }
        }
        return;
    } catch (err) {
        console.warn(
            "collectionGroup(comments) failed, falling back to per-post scan",
        );
    }

    let lastPostDoc: FirebaseFirestore.QueryDocumentSnapshot | undefined;
    while (true) {
        let postsQuery: FirebaseFirestore.Query = adminDb
            .collection("posts")
            .orderBy("__name__")
            .limit(BATCH_LIMIT);
        if (lastPostDoc) postsQuery = postsQuery.startAfter(lastPostDoc);
        const postsSnap = await postsQuery.get();
        if (postsSnap.empty) break;
        for (const postDoc of postsSnap.docs) {
            const postId = postDoc.id;
            while (true) {
                const commentsSnap = await adminDb
                    .collection(`posts/${postId}/comments`)
                    .where("authorId", "==", uid)
                    .limit(BATCH_LIMIT)
                    .get();
                if (commentsSnap.empty) break;
                const b = adminDb.batch();
                commentsSnap.docs.forEach((d) => b.delete(d.ref));
                await b.commit();
                await adminDb.runTransaction(async (tx) => {
                    const postRef = adminDb.doc(`posts/${postId}`);
                    const ps = await tx.get(postRef);
                    if (!ps.exists) return;
                    const curr = (ps.data()?.commentsCount as number) ?? 0;
                    tx.update(postRef, {
                        commentsCount: Math.max(
                            0,
                            curr - commentsSnap.docs.length,
                        ),
                    });
                });
            }
        }
        lastPostDoc = postsSnap.docs[postsSnap.docs.length - 1];
        if (postsSnap.docs.length < BATCH_LIMIT) break;
    }
}

export async function adminDeleteUser(uid: string) {
    const userRef = adminDb.doc(`users/${uid}`);

    await deleteLikesByUser(uid);
    await deleteCommentsByAuthor(uid);

    while (true) {
        const posts = await adminDb
            .collection("posts")
            .where("authorId", "==", uid)
            .limit(BATCH_LIMIT)
            .get();
        if (posts.empty) break;
        for (const post of posts.docs) {
            const postId = post.id;
            await deleteCollection(adminDb.collection(`posts/${postId}/likes`));
            await deleteCollection(
                adminDb.collection(`posts/${postId}/comments`),
            );
            await post.ref.delete();
        }
    }

    await deleteCollection(
        adminDb.collection("projects").where("ownerId", "==", uid),
    );

    const followersSnap = await adminDb
        .collection(`users/${uid}/followers`)
        .get();
    for (const follower of followersSnap.docs) {
        const followerId = follower.id;
        await follower.ref.delete();
        await adminDb.doc(`users/${followerId}/following/${uid}`).delete();
        await decrementUserStat(followerId, "followingCount");
    }

    const followingSnap = await adminDb
        .collection(`users/${uid}/following`)
        .get();
    for (const followed of followingSnap.docs) {
        const followedId = followed.id;
        await followed.ref.delete();
        await adminDb.doc(`users/${followedId}/followers/${uid}`).delete();
        await decrementUserStat(followedId, "followersCount");
    }

    await deleteCollection(adminDb.collection(`users/${uid}/badges`));
    await deleteCollection(adminDb.collection(`users/${uid}/notifications`));
    await userRef.delete();

    try {
        await adminAuth.deleteUser(uid);
    } catch {
        console.warn("Auth user already deleted");
    }

    console.log("User deleted completely:", uid);
}
