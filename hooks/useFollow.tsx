"use client";

import { browserRoutes } from "@/consts/browserRoutes";
import { auth } from "@/lib/firebase";
import {
    addFollower,
    getIsFollower,
    removeFollower,
} from "@/utils/firebaseFunctions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IProps {
    userId: string;
    targetUserId: string;
}

export default function useFollow({ userId, targetUserId }: IProps) {
    const [followed, setFollowed] = useState<boolean>(false);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        if (!targetUserId || !userId) return;
        if (targetUserId === userId) router.push(browserRoutes.profile.link);

        (async () => {
            try {
                const resp = await getIsFollower(userId, targetUserId);
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
    }, [userId, targetUserId, router]);

    const handleToggleFollow = async () => {
        if (!targetUserId || !userId) return;
        if (pending) return;

        const newState = !followed;
        setFollowed(newState);
        setPending(true);

        try {
            if (newState) {
                const ok = await addFollower(targetUserId, userId);
                if (!ok) throw new Error("addFollower failed");
            } else {
                const ok = await removeFollower(targetUserId, userId);
                if (!ok) throw new Error("removeFollower failed");
            }
        } catch (err) {
            console.error("Follow toggle failed:", err);
            setFollowed(!newState);
        } finally {
            setPending(false);
        }
    };

    return { followed, initialized, pending, handleToggleFollow };
}
