import HomeFollowing from "@/components/Home/HomeFollowing";
import HomeNavigation from "@/components/Home/HomeNavigation";
import HomePostList from "@/components/Home/HomePostList";
import PostCreation from "@/components/Post/PostCreation";
import { HomeFeedSkeleton } from "@/components/Skeletons/Home/HomeFeedSkeleton";
import { IPost } from "@/interfaces/interfaces";
import { formatFirestoreDate } from "@/utils/dateConverter";
import { getAllPosts, getFollowingIds } from "@/utils/firebaseFunctions";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { page } = await searchParams;

    const cookieStore = await cookies();
    const uid = cookieStore.get("uid");
    if (!uid || !uid.value) return null;

    const followingIds = await getFollowingIds(uid.value);
    const posts = (await getAllPosts()) ?? [];
    const serializablePosts = posts.map((post) => ({
        ...post,
        createdAt: formatFirestoreDate(post.createdAt),
    })) as IPost[] | [];
    const followingPosts = serializablePosts.filter((post) =>
        followingIds?.includes(post.authorId),
    );

    return (
        <Suspense fallback={<HomeFeedSkeleton />}>
            <div className="flex flex-col gap-2">
                <HomeNavigation />
                <div className="flex flex-col gap-2 items-center justify-center">
                    <PostCreation />
                    {page === "following" ? (
                        <HomeFollowing posts={followingPosts} />
                    ) : (
                        <HomePostList posts={serializablePosts} />
                    )}
                </div>
            </div>
        </Suspense>
    );
}
