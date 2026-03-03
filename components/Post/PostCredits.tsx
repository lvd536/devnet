import { browserRoutes } from "@/consts/browserRoutes";
import Link from "next/link";

interface IProps {
    username: string;
    githubUsername: string | null;
    createdAt: number;
    userId: string;
}

export default function PostCredits({
    username,
    githubUsername,
    createdAt,
    userId,
}: IProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <Link
                href={browserRoutes.user.link(userId)}
                className="flex gap-2 items-center"
            >
                <span className="text-sm font-semibold">
                    {githubUsername || username}
                </span>
                {githubUsername && (
                    <span className="text-sm text-text-muted">@{username}</span>
                )}
            </Link>
            <p className="text-xs text-text/50">
                {new Date(createdAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}
            </p>
        </div>
    );
}
