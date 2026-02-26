import { IPost } from "@/interfaces/interfaces";
import Repository from "../Repository";
import usePostData from "@/hooks/usePostData";
import { Heart, MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { browserRoutes } from "@/consts/browserRoutes";
import PostCredits from "./PostCredits";
import PostAvatar from "./PostAvatar";

interface IProps {
    post: IPost;
}

export default function Post({ post }: IProps) {
    const { project, user, loading, error } = usePostData({ post });

    if (!user) return null;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex w-full gap-4 bg-card rounded-xl p-4">
            <PostAvatar
                username={user.username}
                githubUsername={user.githubUsername}
                avatarUrl={user.avatarUrl}
            />
            <div className="flex w-full flex-col gap-1">
                <PostCredits
                    username={user.username}
                    githubUsername={user.githubUsername}
                    createdAt={post.createdAt}
                />
                {post.content && <p>{post.content}</p>}
                {project && (
                    <Repository repo={project} className="bg-background" />
                )}
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-text-muted" />
                        <span className="text-sm text-text-muted">0</span>
                    </div>
                    <Link
                        href={browserRoutes.post.link(post.id)}
                        className="flex items-center gap-2"
                    >
                        <MessageSquareMore className="w-5 h-5 text-text-muted" />
                        <span className="text-sm text-text-muted">0</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
