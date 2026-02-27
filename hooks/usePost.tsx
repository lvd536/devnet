import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IPost, IProject, IUserProfile } from "@/interfaces/interfaces";
import { getPostData } from "@/utils/firebaseFunctions";

interface IProps {
    postId: string;
}

export default function usePost({ postId }: IProps) {
    const [post, setPost] = useState<IPost | undefined>(undefined);
    const [project, setProject] = useState<IProject | undefined>(undefined);
    const [user, setUser] = useState<IUserProfile | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!postId) return;

        setLoading(true);
        const postRef = doc(db, "posts", postId);

        const unsubscribe = onSnapshot(
            postRef,
            async (snap) => {
                if (!snap.exists()) {
                    setPost(undefined);
                    setError("Post not found");
                    setLoading(false);
                    return;
                }

                const postData = {
                    id: snap.id,
                    ...snap.data(),
                } as IPost;
                setPost(postData);
                try {
                    const { project: p, user: u } = await getPostData(postData);
                    setProject(p);
                    setUser(u);
                } catch {
                    setError("Failed to load related data");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            },
        );

        return () => {
            unsubscribe();
        };
    }, [postId]);

    return { post, project, user, loading, error };
}
