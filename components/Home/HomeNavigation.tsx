"use client";

interface IProps {
    currentPage: "recomendations" | "following";
    setCurrentPage: (
        value: React.SetStateAction<"recomendations" | "following">,
    ) => void;
}

export default function HomeNavigation({
    currentPage,
    setCurrentPage,
}: IProps) {
    return (
        <div className="flex relative items-center justify-center w-full h-12 mt-4 bg-border-light/80 rounded-full">
            <p
                className={`flex flex-col gap-1 items-center justify-center w-1/2 h-1/4 cursor-pointer transition-text duration-300 z-10 ${
                    currentPage === "recomendations"
                        ? "text-text"
                        : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => setCurrentPage("recomendations")}
            >
                Для вас
            </p>
            <p
                className={`flex flex-col gap-1 items-center justify-center w-1/2 h-1/4 cursor-pointer transition-text duration-300 z-10 ${
                    currentPage === "following"
                        ? "text-text"
                        : "text-text-muted"
                } max-lg:text-text`}
                onClick={() => setCurrentPage("following")}
            >
                Подписки
            </p>

            <div
                style={{
                    left: `${currentPage === "recomendations" ? 0 : 1 * 48}%`,
                }}
                className="absolute top-1/2 -translate-y-1/2 w-1/2 h-8/10 bg-border-light rounded-full transition-all duration-300 pointer-events-none z-2 mx-2"
            />
        </div>
    );
}
