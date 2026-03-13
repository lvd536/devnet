"use client";

import { Flag, User, UserKey, Gem, CircleAlert } from "lucide-react";

interface IProps {
    currentPage: "users" | "roles" | "badges" | "banners" | "notifications";
    setCurrentPage: (
        value: React.SetStateAction<
            "users" | "roles" | "badges" | "banners" | "notifications"
        >,
    ) => void;
}

export default function AdminNavigation({
    currentPage,
    setCurrentPage,
}: IProps) {
    const tabsCount = 5;
    const step = 100 / tabsCount;
    const leftPosition =
        (currentPage === "users"
            ? 0.02
            : currentPage === "roles"
              ? 1
              : currentPage === "badges"
                ? 1.98
                : currentPage === "banners"
                  ? 2.98
                  : 3.98) * step;

    return (
        <div className="flex relative items-center justify-center w-full h-12 mt-4 bg-border-light/80 rounded-full">
            <div
                className={`flex flex-col gap-1 items-center justify-center w-1/5 h-full cursor-pointer transition-text duration-300 z-10 ${
                    currentPage === "users" ? "text-text" : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => setCurrentPage("users")}
            >
                <p className="max-sm:hidden">Пользователи</p>
                <User className="sm:hidden w-6 h-6" width={64} height={64} />
            </div>
            <div
                className={`flex flex-col gap-1 items-center justify-center w-1/5 h-full cursor-pointer transition-text duration-300 z-10 ${
                    currentPage === "roles" ? "text-text" : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => setCurrentPage("roles")}
            >
                <p className="max-sm:hidden">Роли</p>
                <Gem className="sm:hidden w-6 h-6" width={64} height={64} />
            </div>
            <div
                className={`flex flex-col gap-1 items-center justify-center w-1/5 h-full cursor-pointer transition-text duration-300 z-10 ${
                    currentPage === "badges" ? "text-text" : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => setCurrentPage("badges")}
            >
                <p className="max-sm:hidden">Бейджики</p>
                <UserKey className="sm:hidden w-6 h-6" width={64} height={64} />
            </div>
            <div
                className={`flex flex-col gap-1 items-center justify-center w-1/5 h-full cursor-pointer transition-text duration-300 z-10 ${
                    currentPage === "banners" ? "text-text" : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => setCurrentPage("banners")}
            >
                <p className="max-sm:hidden">Баннеры</p>
                <Flag className="sm:hidden w-6 h-6" width={64} height={64} />
            </div>
            <div
                className={`flex flex-col gap-1 items-center justify-center w-1/5 h-full cursor-pointer transition-text duration-300 z-10 ${
                    currentPage === "notifications"
                        ? "text-text"
                        : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => setCurrentPage("notifications")}
            >
                <p className="max-sm:hidden">Уведомления</p>
                <CircleAlert
                    className="sm:hidden w-6 h-6"
                    width={64}
                    height={64}
                />
            </div>

            <div
                style={{ left: `${leftPosition}%` }}
                className={`absolute top-1/2 -translate-y-1/2 w-1/${tabsCount} h-8/10 bg-border-light rounded-full transition-all duration-300 pointer-events-none z-2`}
            />
        </div>
    );
}
