"use client";

interface IProps {
    currentPage: "users" | "roles" | "badges";
    setCurrentPage: (
        value: React.SetStateAction<"users" | "roles" | "badges">,
    ) => void;
}

export default function AdminNavigation({
    currentPage,
    setCurrentPage,
}: IProps) {
    const tabsCount = 3;
    const step = 100 / tabsCount;
    const leftPosition =
        (currentPage === "users" ? 0.02 : currentPage === "roles" ? 1 : 1.98) *
        step;

    return (
        <div className="flex relative items-center justify-center w-full h-12 mt-4 bg-border-light/80 rounded-full">
            <p
                className={`flex flex-col gap-1 items-center justify-center w-1/3 h-1/4 cursor-pointer transition-text duration-300 z-10 ${
                    currentPage === "users" ? "text-text" : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => setCurrentPage("users")}
            >
                Пользователи
            </p>
            <p
                className={`flex flex-col gap-1 items-center justify-center w-1/3 h-1/4 cursor-pointer transition-text duration-300 z-10 ${
                    currentPage === "roles" ? "text-text" : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => setCurrentPage("roles")}
            >
                Роли
            </p>
            <p
                className={`flex flex-col gap-1 items-center justify-center w-1/3 h-1/4 cursor-pointer transition-text duration-300 z-10 ${
                    currentPage === "badges" ? "text-text" : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => setCurrentPage("badges")}
            >
                Бейджики
            </p>

            <div
                style={{ left: `${leftPosition}%` }}
                className={`absolute top-1/2 -translate-y-1/2 w-1/${tabsCount} h-8/10 bg-border-light rounded-full transition-all duration-300 pointer-events-none z-2`}
            />
        </div>
    );
}
