import { IComment } from "@/interfaces/interfaces";
import PostAvatar from "./PostAvatar";
import useUserProfile from "@/hooks/useUserProfile";
import Link from "next/link";
import { browserRoutes } from "@/consts/browserRoutes";

interface IProps {
    comment: IComment;
}

export default function Comment({ comment }: IProps) {
    const { userProfile, loading, error } = useUserProfile(comment.authorId);

    if (loading) return <div>Loading...</div>;

    if (!userProfile || error) return null;

    return (
        <div className="flex gap-4">
            <PostAvatar
                avatarUrl={userProfile.avatarUrl}
                githubUsername={userProfile.githubUsername}
                username={userProfile.username}
                userId={userProfile.id!}
            />
            <div className="flex flex-col">
                <Link
                    className="text-sm font-semibold"
                    href={browserRoutes.user.link(userProfile.id!)}
                >
                    {userProfile.githubUsername || userProfile.username}
                </Link>
                <p>{comment.content}</p>
            </div>
        </div>
    );
}
