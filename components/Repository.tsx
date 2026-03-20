import { IProject } from "@/interfaces/interfaces";
import { BookMarked, ExternalLink, Star, GitFork } from "lucide-react";

interface IProps {
    repo: IProject;
    className?: string;
    onClick?: () => void;
}

export default function Repository({ repo, className, onClick }: IProps) {
    return (
        <div
            className={`mt-1 group block w-full rounded-lg border border-border bg-muted/40 hover:bg-muted/70 transition p-3 ${className ?? ""}`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-2 items-center">
                            <BookMarked className="w-3.75 h-3.75 text-text-secondary" />
                            <h4 className="text-sm font-semibold text-text truncate">
                                {repo.repoName}
                            </h4>
                        </div>
                        <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-muted text-text-secondary">
                            Репозиторий
                        </span>
                        <a
                            href={repo.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Открыть репозиторий ${repo.repoName} на GitHub`}
                            onClick={(e) => e.stopPropagation()}
                            className="ml-auto"
                        >
                            <ExternalLink className="w-4 h-4 text-text-secondary group-hover:text-text transition" />
                        </a>
                    </div>
                    {repo.description && (
                        <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                            {repo.description}
                        </p>
                    )}
                    <div className="mt-3 flex gap-3 items-center text-xs text-text-secondary">
                        {repo.language && (
                            <span className="px-2 py-0.5 rounded bg-muted">
                                {repo.language}
                            </span>
                        )}
                        <div className="flex items-center gap-1">
                            <Star className="w-3.25 h-3.25" />
                            <p>{repo.stars}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <GitFork className="w-3.25 h-3.25" />
                            <p>{repo.forks}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
