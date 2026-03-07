"use server";
import { adminDb } from "@/lib/firebaseAdmin";
import { IBadge, IUserBadge } from "@/interfaces/interfaces";
import { getIsAdmin } from "./user";

export async function addBadge(idToken: string, badge: IBadge) {
    try {
        const { isAdmin } = await getIsAdmin(idToken);
        if (!isAdmin) return;

        const badgeRef = adminDb.doc(`badges/${badge.id}`);
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
