import usePostComments from "@/hooks/usePostComments";
import Comment from "./Comment";
import { IComment } from "@/interfaces/interfaces";

interface IProps {
    postId: string;
    localComments: IComment[];
}

export default function CommentList({ postId, localComments }: IProps) {
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
            {[...comments, ...localComments].map((comment) => (
                <Comment comment={comment} key={comment.id} />
            ))}
        </div>
    );
}
