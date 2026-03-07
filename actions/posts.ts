"use server";

import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { processEvent } from "./gamification";

export async function sendPost(
    idToken: string,
    content?: string,
    projectId?: string | null,
) {
    if (!idToken) throw new Error("Unauthorized");
    const decoded = await adminAuth.verifyIdToken(idToken).catch(() => null);
    if (!decoded) throw new Error("Invalid token");

    const userRef = adminDb.doc(`users/${decoded.uid}`);
    const postRef = adminDb.collection(`posts`).doc();
    const post = {
        authorId: decoded.uid,
        content,
        projectId: projectId ?? null,
        likesCount: 0,
        commentsCount: 0,
        createdAt: FieldValue.serverTimestamp(),
    };
    await adminDb.runTransaction(async (tx) => {
        const userSnap = await tx.get(userRef);

        if (!userSnap.exists) {
            throw new Error("User does not exist");
        }

        tx.create(postRef, post);
        tx.update(userRef, {
            "stats.postsCount": (userSnap.data()?.stats?.postsCount ?? 0) + 1,
        });
    });
    await processEvent(decoded.uid, "POST_CREATED");
    return { success: true };
}
