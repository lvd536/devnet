"use client";

import useProfileMeta from "@/hooks/useProfileMeta";
import MetaModal from "../Modals/MetaModal";
import { ProfileMetaSkeleton } from "../Skeletons/Profile/ProfileMetaSkeleton";

interface IProps {
    followersCount: number;
    followingCount: number;
    currentUserId: string;
    targetUserId: string;
}

export default function ProfileMeta({
    followersCount,
    followingCount,
    currentUserId,
    targetUserId,
}: IProps) {
    const { followers, followings, loading } = useProfileMeta({
        currentUserId,
        targetUserId,
    });

    if (loading) return <ProfileMetaSkeleton />;

    return (
        <>
            <div className="flex gap-4 items-center justify-start">
                <div className="flex items-center gap-1.5">
                    <p>{followersCount}</p>
                    <MetaModal
                        label="Подписчики"
                        users={followers}
                        triggerLabel="подписчиков"
                    />
                </div>
                <div className="flex items-center gap-1.5">
                    <p>{followingCount}</p>
                    <MetaModal
                        label="Подписки"
                        users={followings}
                        triggerLabel="подписок"
                    />
                </div>
            </div>
        </>
    );
}
