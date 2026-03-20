"use server";

import { IUserProfile } from "@/interfaces/interfaces";
import { adminAuth, adminDb } from "@/lib/firebase/firebaseAdmin";

export async function getIsAdmin(idToken: string) {
    if (!idToken) throw new Error("Unauthorized");
    const decoded = await adminAuth.verifyIdToken(idToken).catch(() => null);
    if (!decoded) throw new Error("Invalid token");

    const uid = decoded.uid;

    const userSnap = await adminDb
        .doc(`users/${uid}`)
        .get()
        .then(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                }) as IUserProfile,
        );

    if (!userSnap) return { uid, isAdmin: false };

    const isAdmin =
        [userSnap.role, ...(userSnap.roles ?? [])].some((role) =>
            role.permissions.some((perm) => perm.toLowerCase() === "admin"),
        ) || userSnap.role.id === "admin";

    return { uid, isAdmin };
}

export async function editUserCredits(
    idToken: string,
    username: string,
    displayName: string,
    description?: string,
) {
    const { uid } = await getIsAdmin(idToken);
    const userDoc = adminDb.doc(`users/${uid}`);
    const userSnap = await userDoc.get();
    if (!userSnap.exists) return;
    await userDoc.update({
        username,
        githubUsername: displayName,
        description,
    });
}
