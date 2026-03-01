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

    if (loading) return <div>Loading...</div>;

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
                        ? userProfile.followersCount
                        : profile.followersCount
                }
                followingCount={
                    userProfile
                        ? userProfile.followingCount
                        : profile.followingCount
                }
                registerDate={date}
                targetUserId={userProfile ? userProfile.id! : user.uid}
            />
        </>
    );
}
