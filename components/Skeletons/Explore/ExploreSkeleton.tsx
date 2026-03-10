import { Skeleton } from "@/components/ui/skeleton";

export function ExploreSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="h-7 w-20" />

            <div className="flex gap-4 items-center justify-between w-full bg-[#222224] p-4 rounded-3xl h-14">
                <Skeleton className="shrink-0 w-5 h-5 rounded-full bg-white/10" />
                <Skeleton className="w-full h-4 bg-white/10" />
            </div>

            <div className="flex flex-col w-full items-center justify-center gap-4">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="flex mt-4 w-full items-center justify-between px-4"
                    >
                        <div className="flex gap-2 items-center">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex flex-col gap-1">
                                <Skeleton className="w-24 h-4" />
                                <Skeleton className="w-16 h-3" />
                            </div>
                        </div>
                        <Skeleton className="w-20 h-9 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    );
}
