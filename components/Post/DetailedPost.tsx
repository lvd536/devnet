"use client";
import Repository from "../Repository";
import { ChevronLeft } from "lucide-react";
import PostCredits from "./PostCredits";
import PostAvatar from "./PostAvatar";
import { useParams, useRouter } from "next/navigation";
import usePost from "@/hooks/usePost";
import PostCommentInput from "./PostCommentInput";
import CommentList from "./CommentList";
import PostActions from "./PostActions";
import { IComment } from "@/interfaces/interfaces";
import { useState } from "react";

export default function DetailedPost() {
    const { id: postId } = useParams<{ id: string }>();
    const { post, project, user, loading, error } = usePost({ postId });
    const [newComments, setNewComments] = useState<IComment[]>([]);
    const router = useRouter();

    if (!post || !user) return null;
    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

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
                        userId={user.id}
                    />
                    <PostCredits
                        username={user.username}
                        githubUsername={user.githubUsername}
                        createdAt={post.createdAt}
                        userId={user.id}
                        role={user.role}
                    />
                </div>
                <div className="flex w-full flex-col gap-1">
                    {post.content && <p>{post.content}</p>}
                    {project && (
                        <Repository repo={project} className="bg-background" />
                    )}
                    <PostActions
                        commentsCount={post.commentsCount + newComments.length}
                        likesCount={post.likesCount}
                        postId={post.id}
                    />
                    <PostCommentInput
                        postId={post.id}
                        setNewComments={setNewComments}
                    />
                    <CommentList postId={post.id} localComments={newComments} />
                </div>
            </div>
        </div>
    );
}
