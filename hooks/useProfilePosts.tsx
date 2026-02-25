import { IPost } from "@/interfaces/interfaces";
import { getUserPosts } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

interface IProps {
    userId: string;
}

export default function useProfilePosts({ userId }: IProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<IPost[] | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getUserPosts(userId)
            .then((posts) => {
                setPosts(posts);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId]);

    return {
        loading,
        posts,
        error,
    };
}
