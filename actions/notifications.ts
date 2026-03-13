"use server";
import { INotification } from "@/interfaces/interfaces";
import { adminDb } from "@/lib/firebaseAdmin";
import { getIsAdmin } from "./user";
import { FieldValue } from "firebase-admin/firestore";

export async function addNotification(notify: Omit<INotification, "id" | "createdAt">) {
    const notifyDoc = adminDb.collection("notifications");
    await notifyDoc.add({
        ...notify,
        createdAt: FieldValue.serverTimestamp()
    });
}

export async function deleteNotification(idToken: string, notifyId: string) {
    try {
        const { isAdmin } = await getIsAdmin(idToken);
        if (!isAdmin) return;

        const notificationRef = adminDb.doc(`notifications/${notifyId}`);
        await notificationRef.delete();
    } catch (err) {
        console.error(err);
    }
}
