"use client";
import HomePostList from "@/components/Home/HomePostList";
import PostCreation from "@/components/PostCreation";
export default function Home() {
    return (
        <div className="flex flex-col min-h-screen items-start justify-center gap-2">
            <PostCreation />
            <HomePostList />
        </div>
    );
}
