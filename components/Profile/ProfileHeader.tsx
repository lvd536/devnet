"use client";
import { useUserProfileStore } from "@/stores/useProfileStore";
import { Timestamp } from "firebase/firestore";
import ProfileControls from "./ProfileControls";
import ProfileCredits from "./ProfileCredits";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileHeader() {
    const { profile, user } = useUserProfileStore();
    if (!profile || !user) return null;

    const date = (profile.createdAt as Timestamp).toDate();

    return (
        <>
            <div className="relative w-full">
                <div className="w-full h-50 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl" />
                <div className="absolute -bottom-10 inset-x-5 flex justify-between">
                    <ProfileAvatar
                        githubUsername={profile.githubUsername}
                        username={profile.username}
                        avatarUrl={profile.avatarUrl}
                    />
                    <ProfileControls />
                </div>
            </div>
            <ProfileCredits
                githubUsername={profile.githubUsername}
                username={profile.username}
                followersCount={profile.followersCount}
                followingCount={profile.followingCount}
                registerDate={date}
                targetUserId={user.uid}
            />
        </>
    );
}
