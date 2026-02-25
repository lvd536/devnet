import { IPost } from "@/interfaces/interfaces";
import { getAllPosts } from "@/utils/firebaseFunctions";
import { useEffect, useState } from "react";

export default function useAllPosts() {
    const [posts, setPosts] = useState<IPost[] | undefined>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getAllPosts()
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return { posts, loading, error };
}
