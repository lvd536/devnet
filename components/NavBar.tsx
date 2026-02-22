"use client";

import { useState } from "react";

export default function NavBar() {
    const [currentPage, setCurrentPage] = useState<number>(0);

    const leftPosition = currentPage * 20;
    const topPosition = currentPage * 20 + 10;

    return (
        <nav className="flex items-center justify-center max-lg:fixed max-lg:inset-x-0 max-lg:mx-auto bottom-4 left-0 w-[calc(100vw-16px)] h-[68px] lg:h-[350px] lg:w-[74px] bg-white/5 rounded-full">
            <div className="flex relative items-center justify-center w-full h-full mx-2 lg:flex-col">
                {[0, 1, 2, 3, 4].map((index) => (
                    <a
                        key={index}
                        className={`flex items-center justify-center w-1/5 lg:w-9/10 lg:h-1/5 cursor-pointer ${
                            currentPage === index
                                ? "text-white"
                                : "text-gray-400"
                        }`}
                        onClick={() => setCurrentPage(index)}
                    >
                        {index + 1}
                    </a>
                ))}

                <div
                    style={{ left: `${leftPosition}%` }}
                    className="lg:hidden absolute top-1/2 -translate-y-1/2 w-1/5 h-8/10 bg-black/60 rounded-full transition-all duration-300 pointer-events-none"
                />
                <div
                    style={{ top: `${topPosition}%` }}
                    className="max-lg:hidden absolute w-10 h-10 bg-black/60 rounded-full transition-all duration-300 pointer-events-none -translate-y-1/2"
                />
            </div>
        </nav>
    );
}
