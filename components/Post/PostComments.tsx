"use client";

import { useState } from "react";
import { SendHorizonal } from "lucide-react";

export default function PostComments() {
    const [message, setMessage] = useState<string>("");
    
    const handleSendMessage = () => {
        
    }

    return (
        <div className="w-full h-50 border-t border-t-border mt-4 p-2 pt-4">
            <div className="flex gap-1">
                <textarea
                    maxLength={2500}
                    className="p-2 outline-0 w-full h-20 resize-none bg-input-bg rounded-lg"
                    placeholder="Написать комментарий..."
                />
                <SendHorizonal
                    width={35}
                    height={35}
                    className="p-2 bg-input-bg rounded-full hover:shadow-xs hover:shadow-text-secondary/20 transition-shadow duration-300"
                />
            </div>
        </div>
    );
}
