"use client";
import { AdminBadgesTable } from "./AdminBadgesTable";
import AdminBadgeCreation from "./AdminBadgeCreation";
import useBadges from "@/hooks/useBadges";

export default function AdminBadgesTab() {
    const { badges, loading, error } = useBadges();

    if (loading) return <div>Загрузка...</div>;

    if (error) return null;

    return (
        <div className="relative flex w-full h-full flex-col items-center gap-4 mt-2">
            <AdminBadgeCreation badges={badges || []} />
            <AdminBadgesTable badges={badges} />
        </div>
    );
}
