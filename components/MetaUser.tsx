import { IUserSummary } from "@/interfaces/interfaces";
import PostAvatar from "./Post/PostAvatar";
import FollowBtn from "./FollowBtn";
import { auth } from "@/lib/firebase";

interface IProps {
    user: IUserSummary;
}

export default function MetaUser({ user }: IProps) {
    const { id, username, avatarUrl, githubUsername } = user;
    const currentUserId = auth.currentUser?.uid;

    if (!id || !currentUserId) return null;
    if (id === currentUserId) return null;

    return (
        <div className="flex mt-2 w-full items-center justify-between px-4">
            <div className="flex gap-2">
                <PostAvatar
                    avatarUrl={avatarUrl}
                    githubUsername={githubUsername}
                    userId={id}
                    username={username}
                />
                <div className="flex flex-col items-center justify-center">
                    <p className="text-sm">{githubUsername ?? username}</p>
                    {githubUsername && (
                        <p className="text-xs text-text-secondary">
                            @{username}
                        </p>
                    )}
                </div>
            </div>
            <FollowBtn currentUserId={currentUserId} userId={id} />
        </div>
    );
}
