"use client";

import { useState } from "react";
import AdminNavigation from "./AdminNavigation";
import AdminUsersTab from "./Users/AdminUsersTab";
import AdminRolesTab from "./Roles/AdminRolesTab";
import AdminBadgesTab from "./Badges/AdminBadgesTab";
import AdminBannersTab from "./Banners/AdminBannersTab";
import AdminNotificationsTab from "./Notifications/AdminNotificationsTab";

export default function AdminPage() {
    const [currentPage, setCurrentPage] = useState<
        "users" | "roles" | "badges" | "banners" | "notifications"
    >("users");

    return (
        <div className="flex flex-col h-full gap-2">
            <AdminNavigation
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <div className="flex flex-col h-full gap-2 items-center">
                {currentPage === "users" && <AdminUsersTab />}
                {currentPage === "roles" && <AdminRolesTab />}
                {currentPage === "badges" && <AdminBadgesTab />}
                {currentPage === "banners" && <AdminBannersTab />}
                {currentPage === "notifications" && <AdminNotificationsTab />}
            </div>
        </div>
    );
}
