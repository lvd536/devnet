"use server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { IBadge, INotification, IUserBadge } from "@/interfaces/interfaces";
import { getIsAdmin } from "./user";
import { FieldValue } from "firebase-admin/firestore";
import { addNotification } from "./notifications";

export async function addBadge(idToken: string, badge: IBadge) {
    try {
        const { isAdmin } = await getIsAdmin(idToken);
        if (!isAdmin) return;

        const badgeRef = adminDb.doc(`badges/${badge.id}`);
        const badgeSnap = await badgeRef.get();
        if (badgeSnap.exists) return;
        await badgeRef.set(badge);
    } catch (err) {
        console.error(err);
    }
}

export async function deleteBadge(idToken: string, badgeId: string) {
    try {
        const { isAdmin } = await getIsAdmin(idToken);
        if (!isAdmin) return;

        const badgeRef = adminDb.doc(`badges/${badgeId}`);
        await badgeRef.delete();
    } catch (err) {
        console.error(err);
    }
}

export async function setUserBadges(
    idToken: string,
    badges: (IUserBadge & { id?: string })[],
): Promise<string[]> {
    const { isAdmin, uid } = await getIsAdmin(idToken);
    if (!isAdmin) return [];

    const colRef = adminDb.collection(`users/${uid}/badges`);
    const batch = adminDb.batch();

    const existingSnap = await colRef.get();

    const newIds = new Set<string>();
    const createdIds: string[] = [];

    for (const b of badges) {
        let docRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
        if (b.id) {
            docRef = colRef.doc(b.id);
            newIds.add(b.id);
        } else {
            docRef = colRef.doc();
            newIds.add(docRef.id);
            createdIds.push(docRef.id);
        }

        const payload: IUserBadge = {
            ...b,
            awardedAt: b.awardedAt ?? Date.now(),
            awardedBy: b.awardedBy ?? "system",
        };

        batch.set(docRef, payload);
    }

    existingSnap.docs.forEach((d) => {
        if (!newIds.has(d.id)) {
            batch.delete(d.ref);
        }
    });

    await batch.commit();

    return Array.from(newIds);
}

async function giveBadge(userId: string, badgeId: string) {
    const badgeRef = adminDb.doc(`users/${userId}/badges/${badgeId}`);

    const snap = await badgeRef.get();

    if (snap.exists) return;

    badgeRef
        .set({
            awardedAt: FieldValue.serverTimestamp(),
            awardedBy: "system",
        })
        .then(() => {
            const notify: Omit<INotification, "id"> = {
                title: `Вы доступен новый бейдж - ${badgeId}`,
                description: "Можете посмотреть на него в профиле",
                icon: "badge",
                isRead: false,
                toUserId: userId,
                type: "badge",
                createdAt: FieldValue.serverTimestamp(),
            };
            addNotification(notify);
        });
}

export async function checkBadges(userId: string) {
    const user = await adminDb.doc(`users/${userId}`).get();
    const stats = user.data()?.stats;

    if (!stats) return;

    //likes
    if (stats.likesReceived >= 1) {
        await giveBadge(userId, "first-like");
    }
    if (stats.likesReceived >= 10) {
        await giveBadge(userId, "liked");
    }
    if (stats.likesReceived >= 50) {
        await giveBadge(userId, "appreciated");
    }
    if (stats.likesReceived >= 200) {
        await giveBadge(userId, "well-liked");
    }
    if (stats.likesReceived >= 1000) {
        await giveBadge(userId, "community-favorite");
    }

    //comments
    if (stats.commentsCount >= 1) {
        await giveBadge(userId, "first-comment");
    }
    if (stats.commentsCount >= 10) {
        await giveBadge(userId, "talkative");
    }
    if (stats.commentsCount >= 50) {
        await giveBadge(userId, "active-discussion");
    }
    if (stats.commentsCount >= 200) {
        await giveBadge(userId, "discussion-master");
    }
    if (stats.commentsCount >= 1000) {
        await giveBadge(userId, "community-voice");
    }

    //posts
    if (stats.postsCount >= 1) {
        await giveBadge(userId, "new-creator");
    }
    if (stats.postsCount >= 5) {
        await giveBadge(userId, "first-5-posts");
    }
    if (stats.postsCount >= 10) {
        await giveBadge(userId, "middle-creator");
    }
    if (stats.postsCount >= 20) {
        await giveBadge(userId, "senior-creator");
    }

    //followers followings
    if (stats.followersCount >= 1) {
        await giveBadge(userId, "new-media");
    }
    if (stats.followersCount >= 10) {
        await giveBadge(userId, "first-followers");
    }
    if (stats.followersCount >= 50) {
        await giveBadge(userId, "yung-star");
    }
    if (stats.followersCount >= 200) {
        await giveBadge(userId, "media");
    }
    if (stats.followersCount >= 500) {
        await giveBadge(userId, "popular");
    }
    if (stats.followersCount >= 5000) {
        await giveBadge(userId, "media-giant");
    }

    if (stats.followingCount >= 1) {
        await giveBadge(userId, "first-sub");
    }
    if (stats.followingCount >= 10) {
        await giveBadge(userId, "junior-fan");
    }
    if (stats.followingCount >= 100) {
        await giveBadge(userId, "big-fan");
    }
}
