import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IUserProfile } from "@/interfaces/interfaces";
import { MoreHorizontalIcon } from "lucide-react";
import PostAvatar from "../../Post/PostAvatar";
import RolePill from "../../RolePill";
import AdminUserEdit from "./AdminUserEdit";
import { useState } from "react";
import { deleteUser } from "@/utils/firebaseFunctions";
import useUserBadges from "@/hooks/useUserBadges";
import AdminUserBadgesEdit from "./AdminUserBadgesEdit";
import useUserBanners from "@/hooks/useUserBanners";
import AdminUserBannersEdit from "./AdminUserBannersEdit";

interface IProps {
    userId: string;
    users: IUserProfile[] | undefined;
    error: string | null;
}

export function AdminUsersTable({ users, error, userId }: IProps) {
    const [editingUser, setEditingUser] = useState<IUserProfile | null>(null);
    const [editingUserBadges, setEditingUserBadges] = useState<boolean>(false);
    const [editingUserBanners, setEditingUserBanners] =
        useState<boolean>(false);
    const {
        userBadges,
        loading: userBadgesLoading,
        error: userBadgesError,
    } = useUserBadges({ userId });
    const {
        userBanners,
        loading: userBannersLoading,
        error: userBannersError,
    } = useUserBanners({ userId });

    if (userBadgesLoading || userBannersLoading)
        return <div>Загрузка бейджев...</div>;
    if (!users || error || userBadgesError || userBannersError) return null;

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Followers</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                <PostAvatar
                                    avatarUrl={user.avatarUrl}
                                    githubUsername={user.githubUsername}
                                    userId={user.id}
                                    username={user.username}
                                />
                            </TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>
                                <RolePill
                                    role={{ ...user.role }}
                                    variant="outline"
                                    size="sm"
                                    showDot={false}
                                />
                            </TableCell>
                            <TableCell>{user.level}</TableCell>
                            <TableCell>{user.stats.followersCount}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                        >
                                            <MoreHorizontalIcon />
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setEditingUser(user);
                                                }}
                                                className="w-full text-left"
                                            >
                                                Edit
                                            </button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setEditingUserBadges(true);
                                                }}
                                                className="w-full text-left"
                                            >
                                                Edit badges
                                            </button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setEditingUserBanners(true);
                                                }}
                                                className="w-full text-left"
                                            >
                                                Edit banners
                                            </button>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {editingUser && (
                <AdminUserEdit
                    user={editingUser}
                    open={Boolean(editingUser)}
                    onOpenChange={(open) => {
                        if (!open) setEditingUser(null);
                    }}
                />
            )}
            {editingUserBadges && (
                <AdminUserBadgesEdit
                    userBadges={userBadges}
                    open={Boolean(editingUserBadges)}
                    onOpenChange={(open) => {
                        if (!open) setEditingUserBadges(false);
                    }}
                />
            )}
            {editingUserBanners && (
                <AdminUserBannersEdit
                    userBanners={userBanners}
                    open={Boolean(editingUserBanners)}
                    onOpenChange={(open) => {
                        if (!open) setEditingUserBanners(false);
                    }}
                />
            )}
        </>
    );
}
