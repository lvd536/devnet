"use client";
import { useUserProfileStore } from "@/stores/useProfileStore";
import { Timestamp } from "firebase/firestore";
import ProfileControls from "./ProfileControls";
import ProfileCredits from "./ProfileCredits";
import ProfileAvatar from "./ProfileAvatar";
import useUserProfile from "@/hooks/useUserProfile";
import { useParams } from "next/navigation";
import DProfileControls from "./Dynamic/DProfileControls";

export default function ProfileHeader() {
    const { userId } = useParams<{ userId: string }>();
    const { userProfile, loading, error } = useUserProfile(userId);
    const { profile, user } = useUserProfileStore();

    if (loading) return <div>Загрузка...</div>;

    if (!profile || !user || error) return null;

    const date = (
        userProfile
            ? (userProfile.createdAt as Timestamp)
            : (profile.createdAt as Timestamp)
    ).toDate();

    return (
        <>
            <div className="relative w-full">
                <div className="w-full h-50 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl" />
                <div className="absolute -bottom-10 inset-x-5 flex justify-between">
                    <div className="relative">
                        <ProfileAvatar
                            githubUsername={
                                userProfile
                                    ? userProfile.githubUsername
                                    : profile.githubUsername
                            }
                            username={
                                userProfile
                                    ? userProfile.username
                                    : profile.username
                            }
                            avatarUrl={
                                userProfile
                                    ? userProfile.avatarUrl
                                    : profile.avatarUrl
                            }
                        />
                        <div className="absolute -right-1.25 -bottom-1.25 w-7 h-7 rounded-full flex items-center justify-center text-[10px] text-center font-bold bg-linear-to-br from-cyan-500 to-indigo-600 shadow">
                            Lv {userProfile ? userProfile.level : profile.level}
                        </div>
                    </div>
                    {userProfile ? <DProfileControls /> : <ProfileControls />}
                </div>
            </div>
            <ProfileCredits
                githubUsername={
                    userProfile
                        ? userProfile.githubUsername
                        : profile.githubUsername
                }
                username={userProfile ? userProfile.username : profile.username}
                followersCount={
                    userProfile
                        ? userProfile.stats.followersCount
                        : profile.stats.followersCount
                }
                followingCount={
                    userProfile
                        ? userProfile.stats.followingCount
                        : profile.stats.followingCount
                }
                role={userProfile ? userProfile.role : profile.role}
                registerDate={date}
                targetUserId={userProfile ? userProfile.id! : user.uid}
            />
            <div className="mt-3 w-full">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <div>XP 420 / 500</div>
                    <div>84%</div>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                        className="h-2 rounded-full bg-linear-to-r from-purple-500 to-indigo-500"
                        style={{ width: "84%" }}
                    ></div>
                </div>
            </div>
        </>
    );
}
