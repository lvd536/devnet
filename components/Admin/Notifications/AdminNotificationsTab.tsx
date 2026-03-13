"use client";
import { AdminNotificationsTable } from "./AdminNotificationsTable";
import AdminNotificationCreation from "./AdminNotificationCreation";
import { AdminBadgesSkeleton } from "@/components/Skeletons/Admin/AdminBadgesSkeleton";
import useSystemNotifications from "@/hooks/useSystemNotifications";

export default function AdminNotificationsTab() {
    const { notifications, loading, error } = useSystemNotifications();

    if (loading) return <AdminBadgesSkeleton />;

    if (error) return null;

    return (
        <div className="relative flex w-full h-full flex-col items-center gap-4 mt-2">
            <AdminNotificationCreation notifications={notifications || []} />
            <AdminNotificationsTable notifications={notifications} />
        </div>
    );
}
