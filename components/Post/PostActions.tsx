"use client";
import { Heart, MessageSquareMore } from "lucide-react";
import Link from "next/link";

interface IProps {
    likesCount: number;
    commentsCount: number;
    commentLink?: string;
    onLike?: () => void;
    onComment?: () => void;
}

export default function PostActions({
    likesCount,
    commentsCount,
    commentLink,
    onLike,
    onComment,
}: IProps) {
    return (
        <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2" onClick={onLike}>
                <Heart className="w-5 h-5 text-text-muted" />
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
