import { IProject } from "@/interfaces/interfaces";
import { BookMarked, ExternalLink, Star, GitFork } from "lucide-react";

interface IProps {
    repo: IProject;
    className?: string;
    onClick?: () => void;
}

export default function Repository({ repo, className, onClick }: IProps) {
    return (
        <a
            href={repo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-1 group block w-full rounded-lg border border-neutral-700/40 bg-neutral-900/40 hover:bg-neutral-900/60 transition p-3 ${className}`}
            aria-label={`Открыть репозиторий ${repo.repoName} на GitHub`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-2 items-center">
                            <BookMarked
                                width={15}
                                height={15}
                                className="text-text-secondary"
                            />
                            <h4 className="text-sm font-semibold text-neutral-100 truncate">
                                {repo.repoName}
                            </h4>
                        </div>

                        <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                            Репозиторий
                        </span>
                        <ExternalLink
                            href={repo.githubUrl}
                            className="ml-auto w-4 h-4 text-neutral-400 group-hover:text-neutral-200"
                        />
                    </div>
                    {repo.description && (
                        <p className="mt-1 text-xs text-neutral-300 line-clamp-2">
                            {repo.description}
                        </p>
                    )}
                    <div className="mt-3 flex gap-3 items-center text-xs text-neutral-400">
                        {repo.language && (
                            <span className="px-2 py-0.5 rounded bg-neutral-800">
                                {repo.language}
                            </span>
                        )}
                        <div className="flex items-center gap-1">
                            <Star width={13} height={13} />
                            <p>{repo.stars}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <GitFork width={13} height={13} />
                            <p>{repo.forks}</p>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
}
