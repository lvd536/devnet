import { IPost } from "@/interfaces/interfaces";
import Image from "next/image";
import Repository from "./Repository";
import usePostData from "@/hooks/usePostData";
import { Heart, MessageSquareMore } from "lucide-react";

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
            {user.avatarUrl ? (
                <Image
                    src={user.avatarUrl}
                    alt="user avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full ring ring-background"
                />
            ) : (
                <div className="w-10 h-10 rounded-full ring ring-background">
                    {user.githubUsername
                        ? user.githubUsername[0].toUpperCase()
                        : user.username[0].toUpperCase()}
                </div>
            )}
            <div className="flex w-full flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                        {user.githubUsername || user.username}
                    </span>
                    {user.githubUsername && (
                        <span className="text-sm text-text-secondary text-muted-foreground">
                            @{user.username}
                        </span>
                    )}
                    <p className="w-1 h-1 bg-backdrop-background rounded-full" />
                    <p className="text-xs text-muted">
                        {new Date(post.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
                {post.content && <p>{post.content}</p>}
                {project && (
                    <Repository repo={project} className="bg-background" />
                )}
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-text-muted" />
                        <span className="text-sm text-text-muted">0</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageSquareMore className="w-5 h-5 text-text-muted" />
                        <span className="text-sm text-text-muted">0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
