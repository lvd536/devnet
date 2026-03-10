import { IUserProfile } from "@/interfaces/interfaces";
import ExploreSearchUser from "./ExploreSearchUser";

interface IProps {
    users: IUserProfile[] | undefined;
    error: string | null;
}

export default function ExploreUsers({ users, error }: IProps) {
    if (error || !users || users.length < 1)
        return (
            <div className="font-semibold text-text-muted">
                {error
                      ? error
                      : !users || users.length < 1
                        ? "Пусто"
                        : null}
            </div>
        );

    return (
        <div className="flex flex-col w-full items-center justify-center gap-4">
            {users.map((user) => (
                <ExploreSearchUser user={user} key={user.id!} />
            ))}
        </div>
    );
}
