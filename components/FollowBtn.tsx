"use client";

import useFollow from "@/hooks/useFollow";

interface IProps {
    userId: string;
    currentUserId: string;
}

export default function FollowBtn({ currentUserId, userId }: IProps) {
    const { followed, initialized, pending, handleToggleFollow } = useFollow({
        targetUserId: userId,
        userId: currentUserId!,
    });

    if (!userId || !currentUserId) return null;
    if (userId === currentUserId) return null;
    return (
        <button
            type="button"
            className={`rounded-full p-2 font-semibold text-xs ${
                followed
                    ? "bg-transparent text-text"
                    : "bg-text text-background"
            }`}
            onClick={handleToggleFollow}
            disabled={!initialized || pending}
        >
            {followed ? "Отписаться" : "Подписаться"}
        </button>
    );
}
