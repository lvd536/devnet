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
import { INotification } from "@/interfaces/interfaces";
import { auth } from "@/lib/firebase";
import { Label } from "@/components/ui/label";
import { iconMap } from "@/utils/notificationIcons";
import { deleteNotification } from "@/actions/notifications";

interface IProps {
    notifications?: INotification[];
}

export function AdminNotificationsTable({ notifications }: IProps) {
    if (!notifications || notifications.length < 1)
        return (
            <div className="text-md text-text-muted font-semibold">
                Пусто...
            </div>
        );

    function handleDeleteNotification(notifyId: string) {
        const user = auth.currentUser;
        if (!user) return;
        user.getIdToken().then((token) => {
            deleteNotification(token, notifyId);
        });
    }

    return (
        <>
            <Label>Системные уведомления</Label>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Icon</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {notifications.map((notification) => {
                        const Icon = iconMap[notification.icon];
                        return (
                            <TableRow key={notification.id}>
                                <TableCell className="font-medium">
                                    {notification.id}
                                </TableCell>
                                <TableCell>
                                    <Icon />
                                </TableCell>
                                <TableCell>{notification.title}</TableCell>
                                <TableCell>
                                    {notification.description}
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
                                                    handleDeleteNotification(
                                                        notification.id,
                                                    )
                                                }
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}
