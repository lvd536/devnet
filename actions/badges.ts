"use server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { IBadge, INotification, IUserBadge } from "@/interfaces/interfaces";
import { getIsAdmin } from "./user";
import { FieldValue } from "firebase-admin/firestore";
import { addNotification } from "./notifications";
import { DEFAULT_BADGES } from "@/consts/defaultBadges";

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
            awardedAt: b.awardedAt ?? FieldValue.serverTimestamp(),
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
    const badgeSnap = await adminDb.doc(`badges/${badgeId}`).get();
    if (!badgeSnap.exists) return;

    const userBadgeRef = adminDb.doc(`users/${userId}/badges/${badgeId}`);
    const snap = await userBadgeRef.get();
    if (snap.exists) return;

    userBadgeRef
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

    if (!stats) throw new Error("Unauthorized");

    let count = 0;

    for (const badge of DEFAULT_BADGES) {
        if (stats[badge.stat] >= badge.conditionValue) {
            await giveBadge(userId, badge.badgeId);
            count++;
        }
    }

    return count;
}
