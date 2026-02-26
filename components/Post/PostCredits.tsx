interface IProps {
    username: string;
    githubUsername: string | null;
    createdAt: number;
}

export default function PostCredits({
    username,
    githubUsername,
    createdAt,
}: IProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
                {githubUsername || username}
            </span>
            {githubUsername && (
                <span className="text-sm text-text-secondary text-muted-foreground">
                    @{username}
                </span>
            )}
            <p className="w-1 h-1 bg-backdrop-background rounded-full" />
            <p className="text-xs text-muted">
                {new Date(createdAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}
            </p>
        </div>
    );
}
