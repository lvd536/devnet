import { IPost } from "@/interfaces/interfaces";
import { auth } from "@/lib/firebase";
import { getAllPosts, getFollowingIds } from "@/utils/firebaseFunctions";
import { useEffect, useState } from "react";

export default function useHomePosts() {
    const [posts, setPosts] = useState<IPost[] | undefined>([]);
    const [followingPosts, setFollowingPosts] = useState<IPost[] | undefined>(
        [],
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            setTimeout(() => setLoading(false));
            return;
        }
        getFollowingIds(uid).then((ids) => {
            getAllPosts()
                .then((data) => {
                    setPosts(data);
                    setFollowingPosts(
                        data?.filter((post) => ids?.includes(post.authorId)),
                    );
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        });
    }, []);

    return { posts, followingPosts, loading, error };
}
