"use client";
import { Timestamp } from "firebase/firestore";
import ProfileCredits from "../ProfileCredits";
import ProfileAvatar from "../ProfileAvatar";
import useUserProfile from "@/hooks/useUserProfile";
import { useParams } from "next/navigation";
import DProfileControls from "./DProfileControls";

export default function DProfileHeader() {
    const { userId } = useParams<{ userId: string }>();
    const { userProfile, loading, error } = useUserProfile(userId);

    if (loading) return <div>Loading...</div>;

    if (!userProfile || error) return null;

    const date = (userProfile.createdAt as Timestamp).toDate();

    return (
        <>
            <div className="relative w-full">
                <div className="w-full h-50 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl" />
                <div className="absolute -bottom-10 inset-x-5 flex justify-between">
                    <ProfileAvatar
                        githubUsername={userProfile.githubUsername}
                        username={userProfile.username}
                        avatarUrl={userProfile.avatarUrl}
                    />
                    <DProfileControls />
                </div>
            </div>
            <ProfileCredits
                githubUsername={userProfile.githubUsername}
                username={userProfile.username}
                followersCount={userProfile.followersCount}
                followingCount={userProfile.followingCount}
                registerDate={date}
            />
        </>
    );
}
