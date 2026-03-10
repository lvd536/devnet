import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full">
                <Skeleton className="w-full h-50 rounded-2xl" />

                <div className="absolute -bottom-10 inset-x-5 flex justify-between items-end">
                    <div className="relative">
                        <Skeleton className="w-24 h-24 rounded-full border-4 border-background" />
                        <Skeleton className="absolute right-1 bottom-1 w-6 h-6 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-md" />
                </div>
            </div>

            <div className="mt-14 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <Skeleton className="h-4 w-full rounded-full" />

                <div className="flex gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
