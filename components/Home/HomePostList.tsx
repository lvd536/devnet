"use client";
import { IPost } from "@/interfaces/interfaces";
import Post from "../Post/Post";

interface IProps {
    posts: IPost[] | undefined;
}

export default function HomePostList({ posts }: IProps) {
    if (!posts || posts.length < 1) return <div>Постов нет</div>;

    return (
        <div className="flex w-full flex-col gap-2 mt-2">
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}
