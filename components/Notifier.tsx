import { INotification } from "@/interfaces/interfaces";
import { auth, db } from "@/lib/firebase/firebase";
import { sendToast } from "@/utils/toast";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    query,
    and,
    or,
    where,
    orderBy,
    onSnapshot,
} from "firebase/firestore";
import { useMemo, useEffect } from "react";

export default function Notifier() {
    const sessionStartTime = useMemo(() => new Date(), []);

    useEffect(() => {
        const handledIds = new Set<string>();

        const authUnsub = onAuthStateChanged(auth, (user) => {
            if (!user) return;

            const col = collection(db, "notifications");
            const q = query(
                col,
                and(
                    or(
                        where("toUserId", "==", user.uid),
                        where("toUserId", "==", "system"),
                    ),
                    where("createdAt", ">", sessionStartTime),
                ),
                orderBy("createdAt", "desc"),
            );

            const unsub = onSnapshot(
                q,
                (snap) => {
                    snap.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const id = change.doc.id;

                            if (!handledIds.has(id)) {
                                handledIds.add(id);
                                const data = change.doc.data() as INotification;

                                sendToast({
                                    title: data.title,
                                    description: data.description,
                                    type: "info",
                                    position: "bottom-right",
                                });
                            }
                        }
                    });
                },
                (err) => console.error("Snapshot error:", err),
            );

            return () => unsub();
        });

        return () => authUnsub();
    }, [sessionStartTime]);

    return null;
}
