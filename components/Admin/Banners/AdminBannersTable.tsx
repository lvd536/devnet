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
import { IBanner } from "@/interfaces/interfaces";
import { auth } from "@/lib/firebase";
import { deleteBanner } from "@/actions/banners";

interface IProps {
    banners?: IBanner[];
}

export function AdminBannersTable({ banners }: IProps) {
    if (!banners || banners.length < 1)
        return (
            <div className="text-md text-text-muted font-semibold">
                Пусто...
            </div>
        );

    function handleDeleteBanner(bannerId: string) {
        const user = auth.currentUser;
        if (!user) return;
        user.getIdToken().then((token) => {
            deleteBanner(token, bannerId);
        });
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {banners.map((banner) => (
                        <TableRow key={banner.id}>
                            <TableCell className="font-medium">
                                {banner.id}
                            </TableCell>
                            <TableCell>
                                <div
                                    className="w-20 h-10 not-visited:rounded-lg"
                                    style={{
                                        background: `linear-gradient(to right, ${banner.colors.gradientA}, ${banner.colors.gradientB})`,
                                    }}
                                />
                            </TableCell>
                            <TableCell>{banner.title}</TableCell>
                            <TableCell>{banner.description}</TableCell>
                            <TableCell>{banner.condition}</TableCell>
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
                                                handleDeleteBanner(banner.id)
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
