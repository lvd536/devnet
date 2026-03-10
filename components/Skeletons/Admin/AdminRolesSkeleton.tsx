import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function AdminRolesSkeleton() {
    return (
        <div className="relative flex w-full h-full flex-col items-center gap-4 mt-2">
            <Skeleton className="h-10 w-36" />

            <div className="w-full border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {[
                                "Name",
                                "Color",
                                "Priority",
                                "Permissions",
                                "Actions",
                            ].map((head) => (
                                <TableHead key={head}>
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-8" />
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-8 w-8 ml-auto" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
