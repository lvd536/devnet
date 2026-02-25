import useAllPosts from "@/hooks/useAllPosts";
import Post from "../Post";

export default function HomePostList() {
    const { loading, posts, error } = useAllPosts();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!posts) return <div>Постов нет</div>;
    return (
        <div className="flex w-full flex-col gap-2 mt-2">
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}
