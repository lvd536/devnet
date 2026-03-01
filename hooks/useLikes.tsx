import { IPost } from "@/interfaces/interfaces";
import { getLikedPosts } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

interface IProps {
    userId: string;
}

export default function useLikes({ userId }: IProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [likedPosts, setLikedPosts] = useState<IPost[] | undefined>(
        undefined,
    );
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getLikedPosts(userId)
            .then((posts) => {
                setLikedPosts(posts);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId]);

    return {
        loading,
        likedPosts,
        error,
    };
}
