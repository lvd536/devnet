"use client";

import { NAV_ITEMS } from "@/consts/navItems";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import logo from "@/public/logo.svg";

export default function NavBar() {
    const [currentPage, setCurrentPage] = useState<number>(0);

    const leftPosition = currentPage * 25;
    const topPosition = currentPage * 25 + 12;

    return (
        <div className="flex flex-col items-center">
            <Image
                src={logo}
                alt="logo icon"
                width={60}
                height={60}
                className="mb-6"
            />
            <div className="flex items-center justify-center max-lg:fixed max-lg:inset-x-0 max-lg:mx-auto bg-background bottom-4 left-0 w-[calc(100vw-16px)] h-[68px] lg:h-[350px] lg:w-[74px] rounded-full ring ring-border">
                <nav className="flex relative items-center justify-center w-full h-full mx-2 lg:flex-col">
                    {NAV_ITEMS.map((item, index) => (
                        <Link
                            href={item.link}
                            key={index}
                            className={`flex flex-col gap-1 items-center justify-center w-1/4 lg:w-9/10 lg:h-1/4 cursor-pointer transition-text duration-300 z-10 ${
                                currentPage === index
                                    ? "text-card"
                                    : "text-text-muted"
                            } max-lg:text-text`}
                            onClick={() => setCurrentPage(index)}
                        >
                            <item.Icon />
                            <h1
                                className={`lg:hidden text-xs ${currentPage === index && "text-blue-600"} transition-text duration-300`}
                            >
                                {item.label}
                            </h1>
                        </Link>
                    ))}

                    <div
                        style={{ left: `${leftPosition}%` }}
                        className="lg:hidden absolute top-1/2 -translate-y-1/2 w-1/4 h-8/10 bg-border-light rounded-full transition-all duration-300 pointer-events-none z-2"
                    />
                    <div
                        style={{ top: `${topPosition}%` }}
                        className="max-lg:hidden absolute w-12 h-12 bg-text rounded-full transition-all duration-300 pointer-events-none -translate-y-1/2 z-2"
                    />
                </nav>
            </div>
        </div>
    );
}
