"use server";

import { adminDb } from "@/lib/firebaseAdmin";
import { calculateNextLevelXP } from "@/utils/firebaseFunctions";
import { checkBadges } from "./badges";
import { checkBanners } from "./banners";

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
    await checkBanners(userId);
}
