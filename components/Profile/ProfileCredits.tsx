import { Calendar } from "lucide-react";
import ProfileMeta from "./ProfileMeta";
import { auth } from "@/lib/firebase";

interface IProps {
    githubUsername: string | null;
    username: string;
    targetUserId: string;
    followersCount: number;
    followingCount: number;
    registerDate: Date;
}

export default function ProfileCredits({
    githubUsername,
    username,
    targetUserId,
    followersCount,
    followingCount,
    registerDate,
}: IProps) {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return null;

    return (
        <div className="font-medium w-full flex flex-col items-start justify-center gap-2 mt-12">
            <div className="flex gap-3 items-center justify-start">
                <p className="text-lg">{githubUsername ?? username}</p>
                {githubUsername && (
                    <p className="text-md text-text-secondary">@{username}</p>
                )}
            </div>
            <ProfileMeta
                followersCount={followersCount}
                followingCount={followingCount}
                currentUserId={currentUserId}
                targetUserId={targetUserId}
            />
            <div className="flex gap-1 items-center justify-start text-text-secondary">
                <Calendar width={20} height={20} className="mr-1" />
                <p>Регистрация:</p>
                <p>
                    {registerDate.toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            </div>
        </div>
    );
}
