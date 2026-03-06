"use server";

import { IUserProfile } from "@/interfaces/interfaces";
import { adminDb } from "@/lib/firebaseAdmin";

type EventType = "POST_CREATED" | "POST_LIKED" | "POST_COMMENT" | "USER_FOLLOW";

async function awardXp(userId: string, count: number) {
    const userRef = adminDb.doc(`users/${userId}`);
    const userSnap = await userRef.get();
    if (!userSnap.exists || !userSnap.data()) return;
    await userRef.set({
        xp: (userSnap.data() as IUserProfile).xp + count,
    });
}

async function giveBadge(userId: string, badgeId: string) {
    const badgeRef = adminDb.doc(`users/${userId}/badges/${badgeId}`);

    const snap = await badgeRef.get();

    if (snap.exists) return;

    await badgeRef.set({
        awardedAt: Date.now(),
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
        case "POST_COMMENT":
            await awardXp(userId, 10);
            break;
        case "USER_FOLLOW":
            await awardXp(userId, 10);
            break;
    }

    await checkBadges(userId);
}
