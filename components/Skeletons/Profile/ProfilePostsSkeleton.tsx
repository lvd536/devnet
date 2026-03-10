import { PostSkeleton } from "../Post/PostSkeleton";

export function ProfilePostsSkeleton() {
    return (
        <div className="flex w-full flex-col gap-2 mt-2">
            {[...Array(3)].map((_, i) => (
                <PostSkeleton key={i} />
            ))}
        </div>
    );
}
