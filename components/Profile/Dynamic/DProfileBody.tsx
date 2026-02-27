"use client";

import { useState } from "react";
import ProfileNavigation from "../ProfileNavigation";
import DProfilePosts from "./DProfilePosts";
import DProfileLikes from "./DProfileLikes";

export default function DProfileBody() {
    const [currentPage, setCurrentPage] = useState<"posts" | "likes">("posts");

    return (
        <>
            <ProfileNavigation
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            {currentPage === "posts" && <DProfilePosts />}
            {currentPage === "likes" && <DProfileLikes />}
        </>
    );
}
