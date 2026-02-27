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
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (userId) getIsLiked(postId, userId).then((resp) => setIsLiked(resp));
    }, [postId, userId]);

    useEffect(() => {
        if (!userId) return;
        const unsubscribe = setTimeout(() => {
            if (isLiked) addLike(postId, userId).catch(() => setIsLiked(false));
            if (!isLiked)
                deleteLike(postId, userId).catch(() => setIsLiked(true));
        }, 200);
        return () => clearTimeout(unsubscribe);
    }, [isLiked, postId, userId]);

    if (!userId) return null;

    return (
        <div className="flex items-center gap-4 mt-2">
            <div
                className="flex items-center gap-2"
                onClick={() => setIsLiked((prev) => !prev)}
            >
                <Heart
                    className={`w-5 h-5 text-text-muted fill-amber-50/0 ${isLiked && "fill-red-500 stroke-red-500"} transition-all duration-300`}
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
