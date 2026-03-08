import { browserRoutes } from "@/consts/browserRoutes";
import { FirestoreCreatedAt, IRole } from "@/interfaces/interfaces";
import { formatFirestoreDate } from "@/utils/dateConverter";
import Link from "next/link";
import RolePill from "../RolePill";

interface IProps {
    username: string;
    githubUsername: string | null;
    createdAt: FirestoreCreatedAt;
    userId: string;
    role?: IRole;
}

export default function PostCredits({
    username,
    githubUsername,
    createdAt,
    userId,
    role,
}: IProps) {
    return (
        <div className="flex flex-1 min-w-0 gap-3 items-center justify-between">
            <Link href={browserRoutes.user.link(userId)}>
                <h3 className="flex text-sm font-semibold text-neutral-100">
                    {githubUsername || username}
                    {role && (
                        <div className="flex gap-2 ml-2 items-center justify-center">
                            <div className="w-0.75 h-0.75 bg-text-secondary/50 rounded-full" />
                            <RolePill
                                role={role}
                                variant="outline"
                                size="xs"
                                showDot={false}
                            />
                        </div>
                    )}
                </h3>
                <p className="flex text-xs text-neutral-400 mt-0.5">
                    @{username}
                    <div className="flex gap-2 ml-2 items-center justify-center">
                        <div className="w-0.75 h-0.75 bg-text-secondary/50 rounded-full" />
                        {formatFirestoreDate(createdAt)}
                    </div>
                </p>
            </Link>

            <div className="text-xs text-neutral-400">
                <button
                    aria-label="Post actions"
                    className="p-2 rounded-md hover:bg-neutral-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                >
                    ⋯
                </button>
            </div>
        </div>
    );
}
