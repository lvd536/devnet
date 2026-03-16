import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { MoreHorizontalIcon } from "lucide-react";
import { IRole } from "@/interfaces/interfaces";
import { auth } from "@/lib/firebase/firebase";
import { deleteRole } from "@/actions/roles";

interface IProps {
    roles: IRole[];
}

export function AdminRolesTable({ roles }: IProps) {
    if (roles.length < 1)
        return (
            <div className="text-md text-text-muted font-semibold">
                Пусто...
            </div>
        );
    function handleDeleteRole(roleId: string) {
        const user = auth.currentUser;
        if (!user) return;
        user.getIdToken().then((token) => {
            deleteRole(token, roleId);
        });
    }
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.id}>
                            <TableCell className="font-medium">
                                {role.name}
                            </TableCell>
                            <TableCell>
                                <div
                                    className={`w-4 h-4 rounded-full`}
                                    style={{
                                        backgroundColor: role.color,
                                    }}
                                />
                            </TableCell>
                            <TableCell>{role.priority}</TableCell>
                            <TableCell>
                                {role.permissions.length > 0 ? (
                                    role.permissions.map((perm, index) => (
                                        <p
                                            className="text-sm"
                                            key={`permission-${index}`}
                                        >
                                            {perm}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-center font-bold">-</p>
                                )}
                            </TableCell>
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
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() =>
                                                handleDeleteRole(role.id)
                                            }
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
        </>
    );
}
