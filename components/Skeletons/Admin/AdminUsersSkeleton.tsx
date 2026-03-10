import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function AdminUsersSkeleton() {
    return (
        <div className="flex flex-col w-full gap-4 mt-2">
            <div className="flex gap-4 items-center w-full bg-[#222224] p-4 rounded-3xl h-14">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-48 h-4" />
            </div>

            <div className="w-full border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {[
                                "Avatar",
                                "Username",
                                "Role",
                                "Level",
                                "Followers",
                                "Actions",
                            ].map((head) => (
                                <TableHead key={head}>
                                    <Skeleton className="h-4 w-12" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(6)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-8" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-8" />
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
