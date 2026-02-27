"use client";

import { browserRoutes } from "@/consts/browserRoutes";
import { auth } from "@/lib/firebase";
import {
    addFollower,
    getIsFollower,
    removeFollower,
} from "@/utils/firebaseFunctions";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DProfileControls() {
    const [followed, setFollowed] = useState<boolean>(false);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const { userId } = useParams<{ userId: string }>();
    const currentUserId = auth.currentUser?.uid;
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        if (!userId || !currentUserId) return;
        if (userId === currentUserId) router.push(browserRoutes.profile.link);

        (async () => {
            try {
                const resp = await getIsFollower(currentUserId, userId);
                if (!mounted) return;
                setFollowed(!!resp);
            } catch (err) {
                console.error("Failed to get follower status", err);
            } finally {
                if (mounted) setInitialized(true);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [currentUserId, userId, router]);

    const handleToggleFollow = async () => {
        if (!userId || !currentUserId) return;
        if (pending) return;

        const newState = !followed;
        setFollowed(newState);
        setPending(true);

        try {
            if (newState) {
                const ok = await addFollower(userId, currentUserId);
                if (!ok) throw new Error("addFollower failed");
            } else {
                const ok = await removeFollower(userId, currentUserId);
                if (!ok) throw new Error("removeFollower failed");
            }
        } catch (err) {
            console.error("Follow toggle failed:", err);
            setFollowed(!newState);
        } finally {
            setPending(false);
        }
    };

    if (!userId || !currentUserId) return null;
    if (userId === currentUserId) return null;

    return (
        <div className="flex self-end items-center gap-2">
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
        </div>
    );
}
