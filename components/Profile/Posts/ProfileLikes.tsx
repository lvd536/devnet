import Post from "@/components/Post/Post";
import useLikes from "@/hooks/useLikes";
import { auth } from "@/lib/firebase";
import { useParams } from "next/navigation";

export default function ProfileLikes() {
    const { userId } = useParams<{ userId: string }>();
    const { loading, likedPosts, error } = useLikes({
        userId: userId ?? auth.currentUser!.uid,
    });

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;
    if (!likedPosts || likedPosts.length < 1)
        return (
            <div className="text-center text-lg mt-2 text-text-muted">
                Лайков нет
            </div>
        );

    return (
        <div className="flex w-full flex-col gap-2 mt-2">
            {likedPosts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}
