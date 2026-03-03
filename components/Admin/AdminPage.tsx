"use client";

import { useState } from "react";
import AdminNavigation from "./AdminNavigation";

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
                {/*<PostCreation />
                {currentPage === "following" && (
                    <HomeFollowing posts={followingPosts} />
                )}
                {currentPage === "recomendations" && (
                    <HomePostList posts={posts} />
                )}*/}
            </div>
        </div>
    );
}
