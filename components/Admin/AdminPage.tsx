"use client";

import { useState } from "react";
import AdminNavigation from "./AdminNavigation";
import AdminUsersTab from "./AdminUsersTab";

export default function AdminPage() {
    const [currentPage, setCurrentPage] = useState<
        "users" | "roles" | "badges"
    >("users");

    return (
        <div className="flex flex-col gap-2">
            <AdminNavigation
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <div className="flex flex-col gap-2 items-center justify-center">
                {currentPage === "users" && <AdminUsersTab />}
            </div>
        </div>
    );
}
