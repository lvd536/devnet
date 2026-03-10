import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
    return (
        <div className="flex gap-3 w-full max-w-3xl mx-auto p-4 rounded-2xl bg-card border border-neutral-700/20">
            <div className="shrink-0">
                <Skeleton className="w-10 h-10 rounded-full" />
            </div>

            <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <div className="flex gap-4 mt-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                </div>
            </div>
        </div>
    );
}
