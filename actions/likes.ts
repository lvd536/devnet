"use server";
import { adminAuth, adminDb } from "@/lib/firebase/firebaseAdmin";
import { processEvent } from "./gamification";
import { INotification, IPost, IUserProfile } from "@/interfaces/interfaces";
import { FieldValue } from "firebase-admin/firestore";
import { addNotification } from "./notifications";

export async function addLike(postId: string, idToken: string) {
    try {
        if (!idToken) throw new Error("Unauthorized");
        const decoded = await adminAuth
            .verifyIdToken(idToken)
            .catch(() => null);
        if (!decoded) throw new Error("Invalid token");

        const uid = decoded.uid;

        const userRef = adminDb.doc(`users/${uid}`);
        const postRef = adminDb.doc(`posts/${postId}`);
        const likeRef = adminDb.doc(`posts/${postId}/likes/${uid}`);

        await adminDb.runTransaction(async (tx) => {
            const [userSnap, postSnap, likeSnap] = await Promise.all([
                await tx.get(userRef),
                await tx.get(postRef),
                await tx.get(likeRef),
            ]);
            if (!userSnap.exists) throw new Error("User does not exist");
            if (!postSnap.exists) throw new Error("Post does not exist");
            if (likeSnap.exists) throw new Error("Like exists");

            const postCreatorId = (postSnap.data() as IPost).authorId;
            const postCreatorRef = adminDb.doc(`users/${postCreatorId}`);
            const postCreatorSnap = await tx.get(postCreatorRef);
            if (!postCreatorSnap.exists)
                throw new Error("Post creator not exists");

            tx.set(likeRef, {
                createdAt: FieldValue.serverTimestamp(),
                uid,
            });

            const currentLikes = (postSnap.data()?.likesCount as number) || 0;
            tx.update(postRef, {
                likesCount: currentLikes + 1,
            });
            tx.update(userRef, {
                "stats.likesGiven": FieldValue.increment(1),
            });
            tx.update(postCreatorRef, {
                "stats.likesReceived": FieldValue.increment(1),
            });

            const targetId = postCreatorSnap.id;
            const likedUsername = (userSnap.data() as IUserProfile).username;
            const notify: Omit<INotification, "id"> = {
                title: `Получен лайк от ${likedUsername}`,
                icon: "like",
                isRead: false,
                toUserId: targetId,
                type: "like",
                createdAt: FieldValue.serverTimestamp(),
            };
            addNotification(notify);
        });
        processEvent(uid, "POST_LIKED");
    } catch (err) {
        console.error("addLike error:", err);
    }
}

export async function deleteLike(postId: string, idToken: string) {
    try {
        if (!idToken) throw new Error("Unauthorized");
        const decoded = await adminAuth
            .verifyIdToken(idToken)
            .catch(() => null);
        if (!decoded) throw new Error("Invalid token");

        const uid = decoded.uid;

        const userRef = adminDb.doc(`users/${uid}`);
        const postRef = adminDb.doc(`posts/${postId}`);
        const likeRef = adminDb.doc(`posts/${postId}/likes/${uid}`);

        await adminDb.runTransaction(async (tx) => {
            const [userSnap, postSnap, likeSnap] = await Promise.all([
                await tx.get(userRef),
                await tx.get(postRef),
                await tx.get(likeRef),
            ]);
            if (!userSnap.exists) throw new Error("User does not exist");
            if (!postSnap.exists) throw new Error("Post does not exist");
            if (!likeSnap.exists) throw new Error("Like exists");

            const postCreatorId = (postSnap.data() as IPost).authorId;
            const postCreatorRef = adminDb.doc(`users/${postCreatorId}`);
            const postCreatorSnap = await tx.get(postCreatorRef);
            if (!postCreatorSnap.exists)
                throw new Error("Post creator not exists");

            tx.delete(likeRef);

            const currentLikes = (postSnap.data()?.likesCount as number) || 0;
            tx.update(postRef, {
                likesCount: currentLikes > 0 ? currentLikes - 1 : 0,
            });
            tx.update(userRef, {
                "stats.likesGiven":
                    (userSnap.data() as IUserProfile).stats.likesGiven > 0
                        ? FieldValue.increment(-1)
                        : 0,
            });
            tx.update(postCreatorRef, {
                "stats.likesReceived": (postCreatorSnap.data() as IUserProfile)
                    .stats.likesReceived
                    ? FieldValue.increment(-1)
                    : 0,
            });
        });
        processEvent(uid, "POST_DISLIKED");
    } catch (err) {
        console.error("deleteLike error:", err);
    }
}
