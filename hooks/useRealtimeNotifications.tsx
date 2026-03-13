import { INotification } from "@/interfaces/interfaces";
import { useState, useEffect, useMemo } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    writeBatch,
    getDocs,
    limit,
    getDoc,
    deleteDoc,
    or,
} from "firebase/firestore";
import { sendToast } from "@/utils/toast";
import { db } from "@/lib/firebase";

export default function useRealtimeNotifications(userId?: string) {
    const [loading, setLoading] = useState<boolean>(true);
    const [notifications, setNotifications] = useState<INotification[] | null>(
        null,
    );

    useEffect(() => {
        if (!userId) {
            setTimeout(() => {
                setNotifications([]);
                setLoading(false);
            });

            return;
        }

        const col = collection(db, "notifications");

        const q = query(
            col,
            or(
                where("toUserId", "==", userId),
                where("toUserId", "==", "system"),
            ),
            orderBy("createdAt", "desc"),
            limit(200),
        );

        const unsub = onSnapshot(
            q,
            (snap) => {
                const data: INotification[] = snap.docs.map((d) => ({
                    id: d.id,
                    ...(d.data() as Omit<INotification, "id">),
                }));
                setNotifications(data);
                setLoading(false);
            },
            (err) => {
                console.error("notifications onSnapshot error", err);
                sendToast({
                    title: "Ошибка получения уведомлений",
                    description:
                        "Уведомления небыли успешно получены, попробуйте еще раз",
                    type: "error",
                });
                setLoading(false);
            },
        );

        return () => unsub();
    }, [userId]);

    const unreadCount = useMemo(
        () => notifications?.filter((n) => !n.isRead).length ?? 0,
        [notifications],
    );

    async function toggleRead(n: INotification) {
        try {
            const ref = doc(db, "notifications", n.id);
            await updateDoc(ref, { isRead: !n.isRead });
            sendToast({
                title: n.isRead
                    ? "Пометил как непрочитанное"
                    : "Отмечено как прочитанное",
                type: "success",
            });
        } catch (err) {
            console.error(err);
            sendToast({
                title: "Не удалось обновить уведомление",
                type: "error",
            });
        }
    }

    async function markAllRead() {
        if (!notifications || notifications.length === 0) return;
        const batch = writeBatch(db);
        let any = false;
        notifications.forEach((n) => {
            if (!n.isRead) {
                const ref = doc(db, "notifications", n.id);
                batch.update(ref, { isRead: true });
                any = true;
            }
        });
        if (!any) {
            sendToast({
                title: "Уведомления уже прочитаны",
                type: "info",
            });
            return;
        }
        try {
            sendToast({
                title: "Все уведомления помечены как прочитанные",
                type: "success",
            });
            await batch.commit();
        } catch (err) {
            sendToast({
                title: "Не удалось отметить все как прочитанные",
                description: typeof err === "string" ? err : undefined,
                type: "error",
            });
        }
    }

    async function clearAll() {
        if (!notifications || notifications.length === 0) {
            sendToast({
                title: "Нет уведомлений для удаления",
                type: "info",
            });
            return;
        }

        if (!confirm("Удалить все уведомления? Это действие необратимо."))
            return;

        try {
            const docs = await getDocs(
                query(
                    collection(db, "notifications"),
                    where("toUserId", "==", userId),
                ),
            );
            const batch = writeBatch(db);
            docs.docs.forEach((d) => batch.delete(d.ref));
            await batch.commit();
            sendToast({
                title: "Уведомления удалены",
                type: "success",
            });
        } catch (err) {
            sendToast({
                title: "Не удалось очистить уведомления",
                description: typeof err === "string" ? err : undefined,
                type: "error",
            });
        }
    }

    async function deleteNotify(notifyId: string) {
        try {
            const notifyRef = doc(db, "notifications", notifyId);
            deleteDoc(notifyRef);
            sendToast({
                title: "Уведомление удалено",
                type: "success",
            });
        } catch (err) {
            sendToast({
                title: "Не удалось удалить уведомление",
                description: typeof err === "string" ? err : undefined,
                type: "error",
            });
        }
    }

    return {
        loading,
        notifications,
        unreadCount,
        toggleRead,
        markAllRead,
        clearAll,
        deleteNotify,
    };
}
