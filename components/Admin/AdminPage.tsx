"use client";

import { useState } from "react";
import AdminNavigation from "./AdminNavigation";
import AdminUsersTab from "./Users/AdminUsersTab";
import AdminRolesTab from "./Roles/AdminRolesTab";
import AdminBadgesTab from "./Badges/AdminBadgesTab";

export default function AdminPage() {
    const [currentPage, setCurrentPage] = useState<
        "users" | "roles" | "badges"
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
            </div>
        </div>
    );
}
