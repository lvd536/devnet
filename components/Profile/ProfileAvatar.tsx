import Image from "next/image";

interface IProps {
    githubUsername: string | null;
    username: string;
    avatarUrl: string | null;
}

export default function ProfileAvatar({
    username,
    githubUsername,
    avatarUrl,
}: IProps) {
    return (
        <>
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt="user avatar"
                    width={80}
                    height={80}
                    className="rounded-full ring-8 ring-background"
                />
            ) : (
                <div className="flex items-center justify-center w-20 h-20 rounded-full ring-8 ring-background">
                    {githubUsername
                        ? githubUsername[0].toUpperCase()
                        : username[0].toUpperCase()}
                </div>
            )}
        </>
    );
}
