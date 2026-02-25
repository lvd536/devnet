"use client";

import HomePosts from "@/components/Home/HomePosts";
import { useState } from "react";
import HomeNavigation from "./HomeNavigation";
import HomeFollowing from "./HomeFollowing";

export default function HomePage() {
    const [currentPage, setCurrentPage] = useState<
        "recomendations" | "following"
    >("recomendations");
    return (
        <div className="flex flex-col gap-2">
            <HomeNavigation
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            {currentPage === "following" && <HomeFollowing />}
            {currentPage === "recomendations" && <HomePosts />}
        </div>
    );
}
