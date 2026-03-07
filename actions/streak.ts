"use server";

import { IUserProfile } from "@/interfaces/interfaces";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export async function updateStreak(userId: string) {
    const userRef = adminDb.doc(`users/${userId}`);
    const userSnap = await userRef.get();

    if (!userSnap.exists) return;

    const user = { id: userSnap.id, ...userSnap.data() } as IUserProfile;

    const now = new Date();
    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    ).getTime();

    if (!user.stats.lastActiveDate) {
        await userRef.update({
            "stats.lastActiveDate": FieldValue.serverTimestamp(),
            "stats.streakDays": 1,
        });
        return 1;
    }
    const lastActiveDate = new Date(
        (user.stats.lastActiveDate as Timestamp).toDate(),
    );
    const lastActiveMs = lastActiveDate.getTime();

    const lastDate = new Date(lastActiveMs);
    const lastActiveStartOfDay = new Date(
        lastDate.getFullYear(),
        lastDate.getMonth(),
        lastDate.getDate(),
    ).getTime();

    const diffInDays = (today - lastActiveStartOfDay) / (1000 * 60 * 60 * 24);

    if (diffInDays === 1) {
        const newStreak = user.stats.streakDays + 1;
        await userRef.update({
            "stats.lastActiveDate": FieldValue.serverTimestamp(),
            "stats.streakDays": FieldValue.increment(1),
        });
        return newStreak;
    } else if (diffInDays > 1) {
        await userRef.update({
            "stats.lastActiveDate": FieldValue.serverTimestamp(),
            "stats.streakDays": 1,
        });
        return 1;
    }

    return user.stats.streakDays;
}
