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
import PostAvatar from "../Post/PostAvatar";
import RolePill from "../RolePill";

interface IProps {
    users: IUserProfile[] | undefined;
    loading: boolean;
    error: string | null;
}

export function AdminUsersTable({ users, loading, error }: IProps) {
    if (loading) return <div>Загрузка...</div>;
    if (!users || error) return null;

    return (
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
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive">
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
