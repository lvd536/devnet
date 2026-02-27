"use client";
import { auth } from "@/lib/firebase";
import { addLike, deleteLike, getIsLiked } from "@/utils/firebaseFunctions";
import { Heart, MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IProps {
    postId: string;
    likesCount: number;
    commentsCount: number;
    commentLink?: string;
    onComment?: () => void;
}

export default function PostActions({
    postId,
    likesCount,
    commentsCount,
    commentLink,
    onComment,
}: IProps) {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        let mounted = true;
        if (!userId || !postId) return;

        (async () => {
            try {
                const resp = await getIsLiked(postId, userId);
                if (!mounted) return;
                setIsLiked(!!resp);
            } catch (err) {
                console.error("Failed to get liked status", err);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [postId, userId]);

    const handleToggleLike = async () => {
        if (!userId) return;
        if (pending) return;

        const newState = !isLiked;
        setIsLiked(newState);
        setPending(true);

        try {
            if (newState) await addLike(postId, userId);
            else await deleteLike(postId, userId);
        } catch (err) {
            console.error("Like toggle failed:", err);
            setIsLiked(!newState);
        } finally {
            setPending(false);
        }
    };

    if (!userId) return null;

    return (
        <div className="flex items-center gap-4 mt-2">
            <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={handleToggleLike}
                aria-hidden
            >
                <Heart
                    className={`w-5 h-5 text-text-muted fill-amber-50/0 ${
                        isLiked && "fill-red-500 stroke-red-500"
                    } transition-all duration-300`}
                />
                <span className="text-sm text-text-muted">{likesCount}</span>
            </div>

            {commentLink ? (
                <Link
                    href={commentLink}
                    className="flex items-center gap-2"
                    onClick={onComment}
                >
                    <MessageSquareMore className="w-5 h-5 text-text-muted" />
                    <span className="text-sm text-text-muted">
                        {commentsCount}
                    </span>
                </Link>
            ) : (
                <div className="flex items-center gap-2" onClick={onComment}>
                    <MessageSquareMore className="w-5 h-5 text-text-muted" />
                    <span className="text-sm text-text-muted">
                        {commentsCount}
                    </span>
                </div>
            )}
        </div>
    );
}
