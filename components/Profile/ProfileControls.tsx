"use client";

import { auth } from "@/lib/firebase/firebase";
import { useUserProfileStore } from "@/stores/useProfileStore";
import { handleSync } from "@/utils/firebaseFunctions";
import { RefreshCcw, LogOut } from "lucide-react";
import { ProfileEdit } from "../Modals/ProfileEdit";

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
            <ProfileEdit />
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
