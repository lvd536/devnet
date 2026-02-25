"use client";
import { useUserProfileStore } from "@/stores/useProfileStore";
import Image from "next/image";
import { Calendar, LogOut, RefreshCcw } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { handleSync } from "@/utils/firebaseFunctions";

export default function ProfileHeader() {
    const { profile, setProfile, setRepositories, setUser } =
        useUserProfileStore();
    if (!profile) return null;

    const date = (profile.createdAt as Timestamp).toDate();

    const handleLogOut = () => {
        auth.signOut().then(() => {
            setProfile(null);
            setUser(null);
            setRepositories(null);
        });
    };

    const handleSyncRepos = () => {
        handleSync().then(() => window.location.reload());
    };

    return (
        <>
            <div className="relative w-full">
                <div className="w-full h-50 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl" />
                <div className="absolute -bottom-10 inset-x-5 flex justify-between">
                    {profile.avatarUrl ? (
                        <Image
                            src={profile.avatarUrl}
                            alt=""
                            width={80}
                            height={80}
                            className="rounded-full ring-8 ring-background"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-20 h-20 rounded-full ring-8 ring-background">
                            {profile.githubUsername
                                ? profile.githubUsername[0].toUpperCase()
                                : profile.username[0].toUpperCase()}
                        </div>
                    )}
                    <div className="flex self-end items-center gap-2">
                        <button
                            type="button"
                            className="rounded-full bg-text text-background p-2 font-semibold text-xs"
                        >
                            Редактировать
                        </button>
                        <RefreshCcw
                            width={32}
                            height={32}
                            onClick={handleSyncRepos}
                            className="p-2 rounded-full bg-text text-green-500"
                        />
                        <LogOut
                            width={32}
                            height={32}
                            onClick={handleLogOut}
                            className="p-2 rounded-full bg-text text-red-500"
                        />
                    </div>
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
        </>
    );
}
