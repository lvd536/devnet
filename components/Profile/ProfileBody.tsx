"use client";

import { useState } from "react";
import ProfileNavigation from "./ProfileNavigation";
import PostsList from "../Post/PostsList";
import PostCreation from "../Post/PostCreation";
import { useParams } from "next/navigation";

export default function ProfileBody() {
    const [currentPage, setCurrentPage] = useState<"posts" | "likes">("posts");
    const { userId } = useParams<{ userId?: string }>();
    return (
        <>
            <ProfileNavigation
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <div className="flex w-full flex-col gap-2 mt-2">
                {!userId && <PostCreation />}
                {currentPage === "posts" && <PostsList type="user" targetUid={userId} />}
                {currentPage === "likes" && <PostsList type="liked" targetUid={userId} />}
            </div>
        </>
    );
}
