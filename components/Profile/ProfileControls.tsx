"use client";

import { auth } from "@/lib/firebase";
import { useUserProfileStore } from "@/stores/useProfileStore";
import { handleSync } from "@/utils/firebaseFunctions";
import { RefreshCcw, LogOut } from "lucide-react";

export default function ProfileControls() {
    const { setProfile, setRepositories, setUser } = useUserProfileStore();

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
    );
}
