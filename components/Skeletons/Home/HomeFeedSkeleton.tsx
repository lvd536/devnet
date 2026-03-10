import { Skeleton } from "@/components/ui/skeleton";
import { PostSkeleton } from "../Post/PostSkeleton";

export function HomeFeedSkeleton() {
    return (
        <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto">
            <div className="flex items-center justify-center w-full h-12 mt-4 bg-border-light/20 rounded-full p-1">
                <Skeleton className="w-full h-full rounded-full" />
            </div>

            <Skeleton className="w-full h-24 rounded-2xl" />

            <div className="flex flex-col gap-4 mt-2">
                {[...Array(3)].map((_, i) => (
                    <PostSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
