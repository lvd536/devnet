import usePostComments from "@/hooks/usePostComments";
import Comment from "./Comment";

interface IProps {
    postId: string;
}

export default function CommentList({ postId }: IProps) {
    const { comments, loading, error } = usePostComments(postId);

    if (loading) return <div>Загрузка...</div>;

    if (error) return null;

    if (!comments)
        return (
            <div className="text-text-muted text-center my-2">
                Нет комментариев
            </div>
        );

    return (
        <div className="flex flex-col gap-2 mt-2">
            {comments.map((comment) => (
                <Comment comment={comment} key={comment.id} />
            ))}
        </div>
    );
}
