"use client";
import { useEffect, useRef } from "react";
import { useFeedStore } from "@/stores/useFeedStore";
import Post from "./Post";

interface IProps {
    type: "all" | "liked" | "following" | "user";
    targetUid?: string;
}

export default function PostsList({ type, targetUid }: IProps) {
    const feed = useFeedStore((s) => s.feeds[type]);
    const fetchNext = useFeedStore((s) => s.fetchNext);
    const initFeed = useFeedStore((s) => s.initFeed);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (type == "liked" || type == "user") initFeed(type);
        fetchNext(type, targetUid);
    }, [type, fetchNext, targetUid, initFeed]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    feed.hasMore &&
                    !feed.inFlight
                ) {
                    fetchNext(type);
                }
            },
            { rootMargin: "400px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [feed.hasMore, feed.inFlight, fetchNext, type]);

    return (
        <div className="w-full flex flex-col gap-2 mt-2">
            {feed.items.map((p) => (
                <Post key={p.id} post={p} />
            ))}
            {feed.loading && <div className="text-center p-4">Загрузка…</div>}
            {!feed.hasMore && (
                <div className="text-center text-sm text-muted-foreground p-4">
                    Больше записей нет
                </div>
            )}
            <div ref={sentinelRef} />
        </div>
    );
}
