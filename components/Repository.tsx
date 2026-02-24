import { IProject } from "@/interfaces/interfaces";
import { BookMarked, ExternalLink, Star, GitFork } from "lucide-react";
import Link from "next/link";

interface IProps {
    repo: IProject;
    className?: string;
    onClick?: () => void;
}

export default function Repository({ repo, className, onClick }: IProps) {
    return (
        <li
            className={`flex flex-col justify-between rounded-lg p-2 transition-all duration-300 ${className || "bg-card hover:bg-card/75"}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <BookMarked
                        width={20}
                        height={20}
                        className="text-text-secondary"
                    />
                    <p className="font-semibold text-blue-500">
                        {repo.repoName}
                    </p>
                </div>
                <Link
                    href={repo.githubUrl}
                    className="flex gap-2 text-text-secondary hover:text-blue-200 transition-text duration-300 text-xs"
                >
                    <p>Смотреть на Github</p>
                    <ExternalLink width={10} height={10} />
                </Link>
            </div>
            <p className="text-text-secondary text-sm mt-2">
                {repo.description}
            </p>
            <div className="flex gap-4 text-text-secondary text-xs mt-2">
                <p>{repo.language}</p>
                <div className="flex items-center gap-1">
                    <Star width={15} height={15} />
                    <p>{repo.stars}</p>
                </div>
                <div className="flex items-center gap-1">
                    <GitFork width={15} height={15} />
                    <p>{repo.forks}</p>
                </div>
            </div>
        </li>
    );
}
