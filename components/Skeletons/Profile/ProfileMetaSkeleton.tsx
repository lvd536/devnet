import { Skeleton } from "@/components/ui/skeleton";

export function ProfileMetaSkeleton() {
    return (
        <div className="flex gap-4 items-center justify-start">
            <div className="flex gap-1.5 items-center">
                <Skeleton className="h-4 w-6 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
            </div>

            <div className="flex gap-1.5 items-center">
                <Skeleton className="h-4 w-6 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
            </div>
        </div>
    );
}
