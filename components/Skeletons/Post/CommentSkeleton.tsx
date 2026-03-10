import { Skeleton } from "@/components/ui/skeleton";

export function CommentSkeleton() {
    return (
        <div className="flex gap-4 p-2">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />

            <div className="flex flex-col gap-1.5 w-full">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full max-w-sm" />
            </div>
        </div>
    );
}
