import { IUserProfile } from "@/interfaces/interfaces";
import { auth } from "@/lib/firebase";
import PostAvatar from "../Post/PostAvatar";
import FollowBtn from "../FollowBtn";

interface IProps {
    user: IUserProfile;
}

export default function ExploreSearchUser({ user }: IProps) {
    const { id, username, avatarUrl, githubUsername } = user;
    const currentUserId = auth.currentUser?.uid;

    if (!id || !currentUserId) return null;

    return (
        <div className="flex mt-4 w-full items-center justify-between px-4">
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
            {id !== currentUserId && (
                <FollowBtn currentUserId={currentUserId} userId={id} />
            )}
        </div>
    );
}
