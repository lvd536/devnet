"use client";

import useProfileMeta from "@/hooks/useProfileMeta";
import { useState } from "react";
import BaseModal from "../Modals/BaseModal";
import MetaUser from "../MetaUser";

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
    const [isFollowersModalOpen, setIsFollowersModalOpen] =
        useState<boolean>(false);
    const [isFollowingsModalOpen, setIsFollowingsModalOpen] =
        useState<boolean>(false);

    if (loading) return <div>Загрузка...</div>;

    return (
        <>
            <div className="flex gap-4 items-center justify-start">
                <div
                    className="flex gap-1.5"
                    onClick={() => setIsFollowersModalOpen(true)}
                >
                    <p>{followersCount}</p>
                    <p className="text-text-secondary">подписчиков</p>
                </div>
                <div
                    className="flex gap-1.5"
                    onClick={() => setIsFollowingsModalOpen(true)}
                >
                    <p>{followingCount}</p>
                    <p className="text-text-secondary">подписок</p>
                </div>
            </div>
            {isFollowersModalOpen && !isFollowingsModalOpen && (
                <BaseModal
                    label="Подписчики"
                    elements={
                        followers
                            ? followers.map((user) => (
                                  <MetaUser key={user.id} user={user} />
                              ))
                            : []
                    }
                    onClose={() => setIsFollowersModalOpen(false)}
                />
            )}
            {isFollowingsModalOpen && !isFollowersModalOpen && (
                <BaseModal
                    label="Подписки"
                    elements={
                        followings
                            ? followings.map((user) => (
                                  <MetaUser key={user.id} user={user} />
                              ))
                            : []
                    }
                    onClose={() => setIsFollowingsModalOpen(false)}
                />
            )}
        </>
    );
}
