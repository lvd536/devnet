import { IPost } from "@/interfaces/interfaces";
import { getPostData } from "@/utils/firebaseFunctions";
import Image from "next/image";
import Repository from "./Repository";

interface IProps {
    post: IPost;
}

export default async function Post({ post }: IProps) {
    const { project, user } = await getPostData(post);

    if (!user) return null;

    return (
        <div className="flex gap-2 bg-card rounded-lg">
            {user.avatarUrl ? (
                <Image
                    src={user.avatarUrl}
                    alt="user avatar"
                    width={40}
                    height={40}
                    className="rounded-full ring ring-background"
                />
            ) : (
                <div className="w-10 h-10 rounded-full ring ring-background">
                    {user.githubUsername
                        ? user.githubUsername[0].toUpperCase()
                        : user.username[0].toUpperCase()}
                </div>
            )}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold">
                        {user.githubUsername || user.username}
                    </span>
                    {user.githubUsername && (
                        <span className="text-sm text-muted-foreground">
                            @{user.username}
                        </span>
                    )}
                    <p>
                        {new Date(post.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
                {post.content && <p>{post.content}</p>}
                {project && <Repository repo={project} />}
            </div>
        </div>
    );
}
