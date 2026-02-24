"use client";

import { useState } from "react";
import ProfileNavigation from "./ProfileNavigation";
import ProfilePosts from "./ProfilePosts";
import ProfileLikes from "./ProfileLikes";

export default function ProfileBody() {
    const [currentPage, setCurrentPage] = useState<"posts" | "likes">("posts");

    return (
        <>
            <ProfileNavigation
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            {currentPage === "posts" && <ProfilePosts />}
            {currentPage === "likes" && <ProfileLikes />}
        </>
    );
}
