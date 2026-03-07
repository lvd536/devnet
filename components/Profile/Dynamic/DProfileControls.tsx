"use client";

import FollowBtn from "@/components/FollowBtn";
import { auth } from "@/lib/firebase";
import { useParams } from "next/navigation";

export default function DProfileControls() {
    const { userId } = useParams<{ userId: string }>();
    const currentUserId = auth.currentUser?.uid;

    if (!userId || !currentUserId) return null;
    if (userId === currentUserId) return null;

    return (
        <div className="flex self-end items-center gap-2">
            <FollowBtn userId={userId} />
        </div>
    );
}
