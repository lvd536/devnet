import { CommentSkeleton } from "./CommentSkeleton";

export function CommentListSkeleton() {
    return (
        <div className="flex flex-col gap-2 mt-2">
            {[...Array(3)].map((_, i) => (
                <CommentSkeleton key={i} />
            ))}
        </div>
    );
}
