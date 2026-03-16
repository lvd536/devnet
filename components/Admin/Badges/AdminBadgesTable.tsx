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
import { IBadge } from "@/interfaces/interfaces";
import { badgeIcons } from "@/utils/badgeIcons";
import { Badge } from "@/components/Badge";
import { auth } from "@/lib/firebase/firebase";
import { deleteBadge } from "@/actions/badges";

interface IProps {
    badges?: IBadge[];
}

export function AdminBadgesTable({ badges }: IProps) {
    if (!badges || badges.length < 1)
        return (
            <div className="text-md text-text-muted font-semibold">
                Пусто...
            </div>
        );

    function handleDeleteBadge(badgeId: string) {
        const user = auth.currentUser;
        if (!user) return;
        user.getIdToken().then((token) => {
            deleteBadge(token, badgeId);
        });
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Icon</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Rarity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {badges.map((badge) => {
                        const Icon = badgeIcons[badge.icon];
                        return (
                            <TableRow key={badge.id}>
                                <TableCell className="font-medium">
                                    {badge.id}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        icon={Icon}
                                        rarity={badge.rarity}
                                        title={badge.title}
                                        description={badge.description}
                                        size="sm"
                                    />
                                </TableCell>
                                <TableCell>{badge.title}</TableCell>
                                <TableCell>{badge.description}</TableCell>
                                <TableCell>{badge.rarity}</TableCell>
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
                                                    handleDeleteBadge(badge.id)
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
