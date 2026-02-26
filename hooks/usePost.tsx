import { IPost, IProject, IUserProfile } from "@/interfaces/interfaces";
import { getPost, getPostData } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

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
        getPost(postId).then((post) => {
            if (!post) {
                setError("Error while getting post");
                setLoading(false);
                return;
            }
            setPost(post);
            getPostData(post)
                .then(({ project, user }) => {
                    setProject(project);
                    setUser(user);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        });
    }, [postId]);

    return { post, project, user, loading, error };
}
