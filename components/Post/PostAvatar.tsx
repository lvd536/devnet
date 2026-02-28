import { browserRoutes } from "@/consts/browserRoutes";
import Image from "next/image";
import Link from "next/link";

interface IProps {
    username: string;
    githubUsername: string | null;
    avatarUrl: string | null;
    userId: string;
}

export default function PostAvatar({
    username,
    githubUsername,
    avatarUrl,
    userId,
}: IProps) {
    return (
        <Link href={browserRoutes.user.link(userId)}>
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt="user avatar"
                    width={40}
                    height={40}
                    className="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full ring ring-background"
                />
            ) : (
                <div className="flex items-center justify-center min-w-10 min-h-10 max-w-10 max-h-10 rounded-full ring ring-background">
                    {githubUsername
                        ? githubUsername[0].toUpperCase()
                        : username[0].toUpperCase()}
                </div>
            )}
        </Link>
    );
}
