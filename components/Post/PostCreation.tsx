"use client";

import { useUserProfileStore } from "@/stores/useProfileStore";
import Image from "next/image";
import { BookPlus, MessageSquareOff, BookMinus } from "lucide-react";
import { useState } from "react";
import { IProject } from "@/interfaces/interfaces";
import Repository from "../Repository";
import ProfileReposModal from "../Profile/ProfileReposModal";
import { auth } from "@/lib/firebase";
import { sendPost } from "@/actions/posts";

export default function PostCreation() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedRepo, setSelectedRepo] = useState<IProject | null>(null);
    const [message, setMessage] = useState<string>("");
    const { profile } = useUserProfileStore();

    if (!profile) return null;

    const handleSendPost = () => {
        if (!message && !selectedRepo) return;
        const user = auth.currentUser;
        if (!user) return;
        user.getIdToken().then((token) => {
            sendPost(token, message, selectedRepo?.id).then(() => {
                setMessage("");
                setSelectedRepo(null);
            });
        });
    };

    return (
        <>
            <div className="flex w-full min-h-40 rounded-2xl bg-card p-4 gap-4">
                {profile.avatarUrl ? (
                    <Image
                        src={profile.avatarUrl}
                        alt="profile avatar"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                    />
                ) : (
                    <div className="min-w-10 min-h-10 rounded-full ring-8 ring-background" />
                )}
                <div className="w-full">
                    <textarea
                        name="postTextInput"
                        id="postTextInput"
                        placeholder="Что нового?"
                        className="outline-0 w-full h-20 resize-none"
                        maxLength={3500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    {selectedRepo && (
                        <Repository
                            repo={selectedRepo}
                            key={selectedRepo.repoId}
                            className="bg-background/60"
                        />
                    )}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-4 lg:gap-6">
                            <BookPlus
                                width={20}
                                height={20}
                                className="hover:text-text text-text-secondary transition-text duration-300"
                                onClick={() => setIsModalOpen(true)}
                            />
                            <MessageSquareOff
                                width={20}
                                height={20}
                                className="hover:text-text text-text-secondary transition-text duration-300"
                                onClick={() => setMessage("")}
                            />
                            <BookMinus
                                width={20}
                                height={20}
                                className="hover:text-text text-text-secondary transition-text duration-300"
                                onClick={() => setSelectedRepo(null)}
                            />
                        </div>
                        <button
                            type="button"
                            className="rounded-full bg-text text-background py-2 px-4"
                            onClick={handleSendPost}
                        >
                            Опубликовать
                        </button>
                    </div>
                </div>
            </div>
            <ProfileReposModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                setSelectedRepo={setSelectedRepo}
            />
        </>
    );
}
