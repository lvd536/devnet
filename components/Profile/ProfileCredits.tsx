import { Calendar } from "lucide-react";

interface IProps {
    githubUsername: string | null;
    username: string;
    followersCount: number;
    followingCount: number;
    registerDate: Date;
}

export default function ProfileCredits({
    githubUsername,
    username,
    followersCount,
    followingCount,
    registerDate,
}: IProps) {
    return (
        <div className="font-medium w-full flex flex-col items-start justify-center gap-2 mt-12">
            <div className="flex gap-3 items-center justify-start">
                <p className="text-lg">{githubUsername}</p>
                <p className="text-md text-text-secondary">@{username}</p>
            </div>
            <div className="flex gap-4 items-center justify-start">
                <div className="flex gap-1.5">
                    <p>{followersCount}</p>
                    <p className="text-text-secondary">подписчиков</p>
                </div>
                <div className="flex gap-1.5">
                    <p>{followingCount}</p>
                    <p className="text-text-secondary">подписок</p>
                </div>
            </div>
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
