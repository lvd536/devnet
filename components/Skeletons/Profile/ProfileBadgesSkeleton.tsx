import { Skeleton } from "@/components/ui/skeleton";

interface IProps {
    count?: number;
}

export function ProfileBadgesSkeleton({ count = 3 }: IProps) {
    return (
        <div className="flex gap-2 mt-3 flex-wrap">
            {[...Array(count)].map((_, i) => (
                <Skeleton key={i} className="w-8 h-8 rounded-lg" />
            ))}
        </div>
    );
}
