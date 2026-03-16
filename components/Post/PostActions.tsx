"use client";
import { addLike, deleteLike } from "@/actions/likes";
import { auth } from "@/lib/firebase/firebase";
import { getIsLiked } from "@/utils/firebaseFunctions";
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
    const [alreadyLiked, setAlreadyLiked] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const user = auth.currentUser;
    const userId = user?.uid;

    useEffect(() => {
        let mounted = true;
        if (!userId || !postId) return;

        (async () => {
            try {
                const resp = await getIsLiked(postId, userId);
                if (!mounted) return;
                setIsLiked(!!resp);
                setAlreadyLiked(!!resp);
            } catch (err) {
                console.error("Failed to get liked status", err);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [postId, userId]);

    const handleToggleLike = async () => {
        if (!user) return;
        if (pending) return;

        const newState = !isLiked;
        setIsLiked(newState);
        setPending(true);

        try {
            user.getIdToken().then(async (token) => {
                if (newState) await addLike(postId, token);
                else await deleteLike(postId, token);
            });
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
                    className={`w-4.5 h-4.5 text-text-muted fill-amber-50/0 ${
                        isLiked && "fill-red-500 stroke-red-500"
                    } transition-all duration-300`}
                />
                <span className="text-sm text-text-muted">
                    {isLiked && alreadyLiked
                        ? likesCount
                        : isLiked && !alreadyLiked
                          ? likesCount + 1
                          : !isLiked && alreadyLiked
                            ? likesCount - 1
                            : likesCount}
                </span>
            </div>

            {commentLink ? (
                <Link
                    href={commentLink}
                    className="flex items-center gap-2"
                    onClick={onComment}
                >
                    <MessageSquareMore className="w-4.5 h-4.5 text-text-muted" />
                    <span className="text-sm text-text-muted">
                        {commentsCount}
                    </span>
                </Link>
            ) : (
                <div className="flex items-center gap-2" onClick={onComment}>
                    <MessageSquareMore className="w-4.5 h-4.5 text-text-muted" />
                    <span className="text-sm text-text-muted">
                        {commentsCount}
                    </span>
                </div>
            )}
        </div>
    );
}
