import { IPost } from "@/interfaces/interfaces";
import Repository from "../Repository";
import usePostData from "@/hooks/usePostData";

import { browserRoutes } from "@/consts/browserRoutes";
import PostCredits from "./PostCredits";
import PostAvatar from "./PostAvatar";
import PostActions from "./PostActions";
interface IProps {
    post: IPost;
}

export default function Post({ post }: IProps) {
    const { project, user, loading, error } = usePostData({ post });

    if (!user) return null;
    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex gap-3 w-full max-w-3xl mx-auto p-4 rounded-2xl bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/40 shadow-md transition-shadow hover:shadow-lg">
            <div className="shrink-0">
                <PostAvatar
                    username={user.username}
                    githubUsername={user.githubUsername}
                    avatarUrl={user.avatarUrl}
                    userId={user.id!}
                />
            </div>
            <div className="flex w-full flex-col gap-1">
                <PostCredits
                    username={user.username}
                    githubUsername={user.githubUsername}
                    createdAt={post.createdAt}
                    userId={user.id!}
                    role={user.role}
                />
                {post.content ? (
                    <div className="mt-1 text-sm text-neutral-200 prose prose-invert max-w-none">
                        <p className={`whitespace-pre-wrap line-clamp-6`}>
                            {post.content}
                        </p>
                    </div>
                ) : null}
                {project && (
                    <Repository repo={project} className="bg-background" />
                )}
                <PostActions
                    commentsCount={post.commentsCount}
                    likesCount={post.likesCount}
                    commentLink={browserRoutes.post.link(post.id)}
                    postId={post.id}
                />
            </div>
        </div>
    );
}
