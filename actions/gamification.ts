"use server";

import { adminDb } from "@/lib/firebaseAdmin";
import { calculateNextLevelXP } from "@/utils/firebaseFunctions";
import { FieldValue } from "firebase-admin/firestore";

type EventType =
    | "POST_CREATED"
    | "POST_LIKED"
    | "POST_DISLIKED"
    | "POST_COMMENT"
    | "USER_FOLLOW"
    | "USER_UNFOLLOW";

async function awardXp(userId: string, xpToAdd: number) {
    const userRef = adminDb.doc(`users/${userId}`);

    await adminDb.runTransaction(async (tx) => {
        const snap = await tx.get(userRef);

        if (!snap.exists) return;

        const data = snap.data();

        let xp = data?.xp ?? 0;
        let level = data?.level ?? 0;

        xp += xpToAdd;

        let nextLevelXP = calculateNextLevelXP(level);

        while (xp >= nextLevelXP) {
            xp -= nextLevelXP;
            level += 1;
            nextLevelXP = calculateNextLevelXP(level);
        }

        tx.update(userRef, {
            xp,
            level,
        });
    });
}

async function giveBadge(userId: string, badgeId: string) {
    const badgeRef = adminDb.doc(`users/${userId}/badges/${badgeId}`);

    const snap = await badgeRef.get();

    if (snap.exists) return;

    await badgeRef.set({
        awardedAt: FieldValue.serverTimestamp(),
        awardedBy: "system",
    });
}

async function checkBadges(userId: string) {
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

export async function processEvent(userId: string, event: EventType) {
    switch (event) {
        case "POST_CREATED":
            await awardXp(userId, 25);
            break;

        case "POST_LIKED":
            await awardXp(userId, 5);
            break;
        case "POST_DISLIKED":
            await awardXp(userId, -5);
            break;
        case "POST_COMMENT":
            await awardXp(userId, 10);
            break;
        case "USER_FOLLOW":
            await awardXp(userId, 10);
            break;
        case "USER_UNFOLLOW":
            await awardXp(userId, -10);
            break;
    }

    await checkBadges(userId);
}
