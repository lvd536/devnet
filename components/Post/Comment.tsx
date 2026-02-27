import { IComment } from "@/interfaces/interfaces";
import PostAvatar from "./PostAvatar";
import useUserProfile from "@/hooks/useUserProfile";

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
            />
            <div className="flex flex-col">
                <p className="text-sm font-semibold">
                    {userProfile.githubUsername || userProfile.username}
                </p>
                <p>{comment.content}</p>
            </div>
        </div>
    );
}
