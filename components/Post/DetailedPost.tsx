"use client";
import Repository from "../Repository";
import { Heart, MessageSquareMore, ChevronLeft } from "lucide-react";
import PostCredits from "./PostCredits";
import PostAvatar from "./PostAvatar";
import { useParams, useRouter } from "next/navigation";
import usePost from "@/hooks/usePost";
import PostCommentInput from "./PostCommentInput";
import CommentList from "./CommentList";
import PostActions from "./PostActions";

export default function DetailedPost() {
    const { id: postId } = useParams<{ id: string }>();
    const { post, project, user, loading, error } = usePost({ postId });
    const router = useRouter();

    if (!post || !user) return null;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center justify-start">
                <ChevronLeft onClick={() => router.back()} />
                <p className="font-semibold text-xl">Пост</p>
            </div>
            <div className="flex flex-col w-full gap-4 bg-card rounded-xl p-4">
                <div className="flex gap-4">
                    <PostAvatar
                        username={user.username}
                        githubUsername={user.githubUsername}
                        avatarUrl={user.avatarUrl}
                    />
                    <PostCredits
                        username={user.username}
                        githubUsername={user.githubUsername}
                        createdAt={post.createdAt}
                    />
                </div>
                <div className="flex w-full flex-col gap-1">
                    {post.content && <p>{post.content}</p>}
                    {project && (
                        <Repository repo={project} className="bg-background" />
                    )}
                    <PostActions
                        commentsCount={post.commentsCount}
                        likesCount={post.likesCount}
                    />
                    <PostCommentInput postId={post.id} />
                    <CommentList postId={post.id} />
                </div>
            </div>
        </div>
    );
}
