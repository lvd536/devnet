"use client";
import { useUserProfileStore } from "@/stores/useProfileStore";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { Timestamp } from "firebase/firestore";

export default function page() {
    const { profile } = useUserProfileStore();
    if (!profile) return null;

    const date = (profile.createdAt as Timestamp).toDate();

    return (
        <div className="flex flex-col gap-2 mt-10">
            <div className="relative w-full">
                <div className="w-full h-50 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl" />
                <div className="flex w-full justify-between absolute -bottom-10 left-5">
                    {profile.avatarUrl ? (
                        <Image
                            src={profile.avatarUrl}
                            alt=""
                            width={80}
                            height={80}
                            className="rounded-full ring-8 ring-background"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full ring-8 ring-background" />
                    )}
                    <button
                        type="button"
                        className="self-end rounded-full bg-text text-background p-2 font-semibold text-xs mr-10"
                    >
                        Редактировать
                    </button>
                </div>
            </div>
            <div className="font-medium w-full flex flex-col items-start justify-center gap-2 mt-12">
                <div className="flex gap-3 items-center justify-start">
                    <p className="text-lg">{profile.githubUsername}</p>
                    <p className="text-md text-text-secondary">
                        @{profile.username}
                    </p>
                </div>
                <div className="flex gap-4 items-center justify-start">
                    <div className="flex gap-1.5">
                        <p>0</p>
                        <p className="text-text-secondary">подписчиков</p>
                    </div>
                    <div className="flex gap-1.5">
                        <p>0</p>
                        <p className="text-text-secondary">подписок</p>
                    </div>
                </div>
                <div className="flex gap-1 items-center justify-start text-text-secondary">
                    <Calendar width={20} height={20} className="mr-1" />
                    <p>Регистрация:</p>
                    <p>
                        {date.toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
