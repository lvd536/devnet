import { IPost, IProject, IUserProfile } from "@/interfaces/interfaces";
import { getPostData } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

interface IProps {
    post: IPost;
}

export default function usePostData({ post }: IProps) {
    const [project, setProject] = useState<IProject | undefined>(undefined);
    const [user, setUser] = useState<IUserProfile | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
    }, [post]);

    return { project, user, loading, error };
}
