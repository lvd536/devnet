import { IComment } from "@/interfaces/interfaces";
import { getComments } from "@/utils/firebaseFunctions";
import { useEffect, useState } from "react";

export default function usePostComments(postId: string) {
    const [comments, setComments] = useState<IComment[] | undefined>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getComments(postId)
            .then((data) => {
                setComments(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [postId]);

    return { comments, loading, error };
}
