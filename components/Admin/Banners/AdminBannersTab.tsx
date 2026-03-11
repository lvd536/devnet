"use client";
import { AdminBannersTable } from "./AdminBannersTable";
import AdminBannerCreation from "./AdminBannerCreation";
import useBanners from "@/hooks/useBanners";
import { AdminBadgesSkeleton } from "@/components/Skeletons/Admin/AdminBadgesSkeleton";

export default function AdminBannersTab() {
    const { banners, loading, error } = useBanners();

    if (loading) return <AdminBadgesSkeleton />;

    if (error) return null;

    return (
        <div className="relative flex w-full h-full flex-col items-center gap-4 mt-2">
            <AdminBannerCreation banners={banners || []} />
            <AdminBannersTable banners={banners} />
        </div>
    );
}
