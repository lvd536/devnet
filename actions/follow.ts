"use server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { processEvent } from "./gamification";
import { INotification, IUserProfile } from "@/interfaces/interfaces";
import { FieldValue } from "firebase-admin/firestore";
import { addNotification } from "./notifications";

export async function addFollower(
    targetUserId: string,
    idToken: string,
): Promise<boolean> {
    try {
        if (!idToken) throw new Error("Unauthorized");
        const decoded = await adminAuth
            .verifyIdToken(idToken)
            .catch(() => null);
        if (!decoded) throw new Error("Invalid token");

        const uid = decoded.uid;

        const targetRef = adminDb.doc(`users/${targetUserId}`);
        const currentRef = adminDb.doc(`users/${uid}`);

        const followerRef = adminDb.doc(
            `users/${targetUserId}/followers/${uid}`,
        );
        const followingRef = adminDb.doc(
            `users/${uid}/following/${targetUserId}`,
        );

        await adminDb.runTransaction(async (tx) => {
            const [targetSnap, currentSnap, followerSnap] = await Promise.all([
                tx.get(targetRef),
                tx.get(currentRef),
                tx.get(followerRef),
            ]);

            if (!targetSnap.exists) {
                throw new Error("Target user does not exist");
            }
            if (!currentSnap.exists) {
                throw new Error("Current user does not exist");
            }

            if (followerSnap.exists) {
                return;
            }

            tx.set(followerRef, { createdAt: FieldValue.serverTimestamp() });
            tx.set(followingRef, { createdAt: FieldValue.serverTimestamp() });

            tx.update(targetRef, {
                "stats.followersCount": FieldValue.increment(1),
            });
            tx.update(currentRef, {
                "stats.followingCount": FieldValue.increment(1),
            });
            
            const targetId = targetSnap.id
            const followerUsername = (currentSnap.data() as IUserProfile).username
            const notify: Omit<INotification, "id"> = {
                title: `Новый подписчик: ${followerUsername}`,
                icon: "follow",
                isRead: false,
                toUserId: targetId,
                type: "follow",
                createdAt: FieldValue.serverTimestamp(),
            };
            addNotification(notify);
        });
        processEvent(uid, "USER_FOLLOW");
        return true;
    } catch (err) {
        console.error("addFollower error:", err);
        return false;
    }
}

export async function removeFollower(
    targetUserId: string,
    idToken: string,
): Promise<boolean> {
    try {
        if (!idToken) throw new Error("Unauthorized");
        const decoded = await adminAuth
            .verifyIdToken(idToken)
            .catch(() => null);
        if (!decoded) throw new Error("Invalid token");

        const uid = decoded.uid;

        const targetRef = adminDb.doc(`users/${targetUserId}`);
        const currentRef = adminDb.doc(`users/${uid}`);

        const followerRef = adminDb.doc(
            `users/${targetUserId}/followers/${uid}`,
        );
        const followingRef = adminDb.doc(
            `users/${uid}/following/${targetUserId}`,
        );

        await adminDb.runTransaction(async (tx) => {
            const [targetSnap, currentSnap, followerSnap] = await Promise.all([
                tx.get(targetRef),
                tx.get(currentRef),
                tx.get(followerRef),
            ]);

            if (!targetSnap.exists || !currentSnap.exists) {
                throw new Error("One of users does not exist");
            }

            if (!followerSnap.exists) {
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
                tx.update(targetRef, {
                    "stats.followersCount": FieldValue.increment(-1),
                });
            if (currentFollowing > 0)
                tx.update(currentRef, {
                    "stats.followingCount": FieldValue.increment(-1),
                });

            tx.delete(followerRef);
            tx.delete(followingRef);
        });
        processEvent(uid, "USER_UNFOLLOW");
        return true;
    } catch (err) {
        console.error("removeFollower error:", err);
        return false;
    }
}
