import { Skeleton } from "@/components/ui/skeleton";

export function DetailedPostSkeleton() {
    return (
        <div className="flex gap-3 w-full max-w-3xl mx-auto p-4 rounded-2xl bg-card border border-neutral-700/20">
            <div className="shrink-0">
                <Skeleton className="w-10 h-10 rounded-full" />
            </div>

            <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                </div>

                <div className="space-y-1.5 mt-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                <Skeleton className="h-20 w-full mt-2 rounded-xl" />

                <div className="flex items-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-sm" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-sm" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                </div>
            </div>
        </div>
    );
}
