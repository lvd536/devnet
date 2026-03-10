"use client";
import { useUserProfileStore } from "@/stores/useProfileStore";
import { Timestamp } from "firebase/firestore";
import ProfileControls from "./ProfileControls";
import ProfileCredits from "./ProfileCredits";
import ProfileAvatar from "./ProfileAvatar";
import useUserProfile from "@/hooks/useUserProfile";
import { useParams } from "next/navigation";
import DProfileControls from "./Dynamic/DProfileControls";
import ProfileExpBar from "./ProfileExpBar";
import ProfileBadges from "./ProfileBadges";
import { ProfileHeaderSkeleton } from "../Skeletons/Profile/ProfileHeaderSkeleton";

export default function ProfileHeader() {
    const { userId } = useParams<{ userId: string }>();
    const { userProfile, loading, error } = useUserProfile(userId);
    const { profile, user } = useUserProfileStore();

    if (loading) return <ProfileHeaderSkeleton />;

    if (!profile || !user || error) return null;

    const {
        username,
        githubUsername,
        role,
        level,
        stats,
        xp,
        avatarUrl,
        roles,
        id,
        createdAt,
    } = userProfile || profile;

    const date = (createdAt as Timestamp).toDate();

    return (
        <>
            <div className="relative w-full">
                <div className="w-full h-50 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl" />
                <div className="absolute -bottom-10 inset-x-5 flex justify-between">
                    <div className="relative">
                        <ProfileAvatar
                            githubUsername={githubUsername}
                            username={username}
                            avatarUrl={avatarUrl}
                        />
                        <div className="absolute -right-1.25 -bottom-1.25 w-7 h-7 rounded-full flex items-center justify-center text-[10px] text-center font-bold bg-linear-to-br from-cyan-500 to-indigo-600 shadow">
                            Lv {level}
                        </div>
                    </div>
                    {userProfile ? <DProfileControls /> : <ProfileControls />}
                </div>
            </div>
            <ProfileCredits
                githubUsername={githubUsername}
                username={username}
                followersCount={stats.followersCount}
                followingCount={stats.followingCount}
                role={role}
                roles={roles}
                registerDate={date}
                targetUserId={id || user.uid}
            />
            <ProfileExpBar level={level} xp={xp} />
            <ProfileBadges userId={id} streak={stats.streakDays} />
        </>
    );
}
