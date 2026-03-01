"use client";

import { useState } from "react";
import HomeNavigation from "./HomeNavigation";
import HomeFollowing from "./HomeFollowing";
import useHomePosts from "@/hooks/useHomePosts";
import PostCreation from "../Post/PostCreation";
import HomePostList from "./HomePostList";

export default function HomePage() {
    const [currentPage, setCurrentPage] = useState<
        "recomendations" | "following"
    >("recomendations");
    const { loading, posts, followingPosts, error } = useHomePosts();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col gap-2">
            <HomeNavigation
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <div className="flex flex-col gap-2 items-center justify-center">
                <PostCreation />
                {currentPage === "following" && (
                    <HomeFollowing posts={followingPosts} />
                )}
                {currentPage === "recomendations" && (
                    <HomePostList posts={posts} />
                )}
            </div>
        </div>
    );
}
