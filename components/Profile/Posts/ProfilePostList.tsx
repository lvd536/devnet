"use client";
import Post from "@/components/Post";
import useProfilePosts from "@/hooks/useProfilePosts";
import { auth } from "@/lib/firebase";

export default function ProfilePostList() {
    const { loading, posts, error } = useProfilePosts({
        userId: auth.currentUser!.uid,
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!posts) return <div>Постов нет</div>;

    return (
        <div className="flex w-full flex-col gap-2">
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}
