import { INotification } from "@/interfaces/interfaces";
import { adminDb } from "@/lib/firebaseAdmin";

export async function addNotification(notify: Omit<INotification, "id">) {
    const notifyDoc = adminDb.collection("notifications");
    await notifyDoc.add(notify);
}
