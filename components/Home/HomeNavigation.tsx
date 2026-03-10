"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function HomeNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleClick = (page: "recommendations" | "following") => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page);
        router.push(`${pathname}?${params.toString()}`);
    };
    return (
        <div className="flex relative items-center justify-center w-full h-12 mt-4 bg-border-light/80 rounded-full">
            <p
                className={`flex flex-col gap-1 items-center justify-center w-1/2 h-1/4 cursor-pointer transition-text duration-300 z-10 ${
                    searchParams.get("page") !== "following"
                        ? "text-text"
                        : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => handleClick("recommendations")}
            >
                Для вас
            </p>
            <p
                className={`flex flex-col gap-1 items-center justify-center w-1/2 h-1/4 cursor-pointer transition-text duration-300 z-10 ${
                    searchParams.get("page") === "following"
                        ? "text-text"
                        : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => handleClick("following")}
            >
                Подписки
            </p>

            <div
                style={{
                    left: `${searchParams.get("page") === "following" ? 1 * 48 : 0}%`,
                }}
                className="absolute top-1/2 -translate-y-1/2 w-1/2 h-8/10 bg-border-light rounded-full transition-all duration-300 pointer-events-none z-2 mx-2"
            />
        </div>
    );
}
