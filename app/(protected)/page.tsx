import HomeNavigation from "@/components/Home/HomeNavigation";
import PostCreation from "@/components/Post/PostCreation";
import PostsList from "@/components/Post/PostsList";
import { HomeFeedSkeleton } from "@/components/Skeletons/Home/HomeFeedSkeleton";
import { Suspense } from "react";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { page } = await searchParams;

    return (
        <Suspense fallback={<HomeFeedSkeleton />}>
            <div className="flex flex-col gap-2">
                <HomeNavigation />
                <div className="flex flex-col gap-2 items-center justify-center">
                    <PostCreation />
                    {page === "following" ? (
                        <PostsList type="following" />
                    ) : (
                        <PostsList type="all" />
                    )}
                </div>
            </div>
        </Suspense>
    );
}
