"use server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { processEvent } from "./gamification";
import { IUserProfile } from "@/interfaces/interfaces";
import { FieldValue } from "firebase-admin/firestore";

export async function addComment(
    idToken: string,
    postId: string,
    message: string,
) {
    try {
        if (!idToken) throw new Error("Unauthorized");
        const decoded = await adminAuth
            .verifyIdToken(idToken)
            .catch(() => null);
        if (!decoded) throw new Error("Invalid token");

        const uid = decoded.uid;

        const userRef = adminDb.doc(`users/${uid}`);
        const postRef = adminDb.doc(`posts/${postId}`);
        const commentsCol = adminDb.collection(`posts/${postId}/comments`);
        const commentRef = commentsCol.doc();

        await adminDb.runTransaction(async (tx) => {
            const [userSnap, postSnap] = await Promise.all([
                await tx.get(userRef),
                await tx.get(postRef),
            ]);

            if (!userSnap.exists) throw new Error("User does not exist");
            if (!postSnap.exists) throw new Error("Post does not exist");

            tx.set(commentRef, {
                authorId: uid,
                content: message,
                createdAt: FieldValue.serverTimestamp(),
            });

            const currentComments =
                (postSnap.data()?.commentsCount as number) || 0;

            tx.update(postRef, {
                commentsCount: currentComments + 1,
            });

            tx.update(userRef, {
                "stats.commentsCount": FieldValue.increment(1),
            });
        });
        processEvent(uid, "POST_COMMENT");
    } catch (err) {
        console.error("addComment error:", err);
    }
}

export async function deleteComment(
    idToken: string,
    postId: string,
    commentId: string,
) {
    try {
        if (!idToken) throw new Error("Unauthorized");
        const decoded = await adminAuth
            .verifyIdToken(idToken)
            .catch(() => null);
        if (!decoded) throw new Error("Invalid token");

        const uid = decoded.uid;

        const userRef = adminDb.doc(`users/${uid}`);
        const postRef = adminDb.doc(`posts/${postId}`);
        const commentRef = adminDb.doc(`posts/${postId}/comments/${commentId}`);

        await adminDb.runTransaction(async (tx) => {
            const [userSnap, postSnap, commentSnap] = await Promise.all([
                await tx.get(userRef),
                await tx.get(postRef),
                await tx.get(commentRef),
            ]);

            if (!userSnap.exists) throw new Error("User does not exist");
            if (!postSnap.exists) throw new Error("Post does not exist");
            if (!commentSnap.exists) throw new Error("Comment does not exist");

            tx.delete(commentRef);

            const currentComments =
                (postSnap.data()?.commentsCount as number) || 0;

            tx.update(postRef, {
                commentsCount: currentComments > 0 ? currentComments - 1 : 0,
            });

            tx.update(userRef, {
                "stats.commentsCount":
                    (userSnap.data() as IUserProfile).stats.commentsCount > 0
                        ? FieldValue.increment(-1)
                        : 0,
            });
        });
    } catch (err) {
        console.error("deleteComment error:", err);
    }
}
