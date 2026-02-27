"use client";

import { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { auth } from "@/lib/firebase";
import { addComment } from "@/utils/firebaseFunctions";

interface IProps {
    postId: string;
}

export default function PostCommentInput({ postId }: IProps) {
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const userId = auth.currentUser?.uid;

    const handleSendMessage = () => {
        if (error || !userId) return;
        if (!message) {
            setError("Вы не написали сообщение");
            return;
        }
        addComment(userId, postId, message)
            .then(() => window.location.reload())
            .catch((err) => {
                setError(err);
            });
    };

    if (!userId) return null;

    return (
        <div className="w-full h-50 border-t border-t-border mt-4 p-2 pt-4">
            <div className="flex gap-1">
                <textarea
                    maxLength={2500}
                    className="p-2 outline-0 w-full h-20 resize-none bg-input-bg rounded-lg"
                    placeholder="Написать комментарий..."
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        setError(null);
                    }}
                />
                <SendHorizonal
                    width={35}
                    height={35}
                    className="p-2 bg-input-bg rounded-full hover:shadow-xs hover:shadow-text-secondary/20 transition-shadow duration-300"
                    onClick={handleSendMessage}
                />
            </div>
            {error && <p className="text-center text-red-500">{error}</p>}
        </div>
    );
}
