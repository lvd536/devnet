"use client";
import Post from "@/components/Post/Post";
import useProfilePosts from "@/hooks/useProfilePosts";
import { auth } from "@/lib/firebase";
import { useParams } from "next/navigation";

interface IProps {
    isOtherUser?: boolean;
}

export default function ProfilePostList({ isOtherUser }: IProps) {
    const { userId } = useParams<{ userId: string }>();
    const { loading, posts, error } = useProfilePosts({
        userId: isOtherUser ? userId : auth.currentUser!.uid,
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!posts) return <div>Постов нет</div>;

    return (
        <div className="flex w-full flex-col gap-2 mt-2">
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}
