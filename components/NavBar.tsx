"use client";

import { NAV_ITEMS } from "@/consts/navItems";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { usePathname } from "next/navigation";
import { useUserProfileStore } from "@/stores/useProfileStore";
import { browserRoutes } from "@/consts/browserRoutes";

export default function NavBar() {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const { profile } = useUserProfileStore();
    const isAdmin = profile
        ? [profile.role, ...(profile.roles ?? [])].some((role) =>
              role.permissions.some((perm) => perm.toLowerCase() === "admin"),
          )
        : false;
    const pathname = usePathname();

    const tabsCount = isAdmin ? NAV_ITEMS.length : NAV_ITEMS.length - 1;
    const step = 100 / tabsCount;
    const leftPosition = currentPage * step;
    const topPosition = (currentPage + 0.5) * step;

    useEffect(() => {
        const findIndex = NAV_ITEMS.findIndex((i) => i.link === pathname);
        if (findIndex !== -1) setTimeout(() => setCurrentPage(findIndex));
    }, [pathname]);

    return (
        <div className="flex flex-col items-center z-10">
            <Image
                src={logo}
                alt="logo icon"
                width={60}
                height={60}
                className="max-lg:hidden lg:mb-6"
            />
            <div className="flex items-center justify-center max-lg:fixed max-lg:inset-x-0 max-lg:mx-auto bg-background bottom-4 left-0 w-[calc(100vw-16px)] h-17 lg:h-87.5 lg:w-18.5 rounded-full ring ring-border">
                <nav className="flex flex-1 relative items-center justify-center w-full h-full mx-2 lg:flex-col">
                    {NAV_ITEMS.map((item, index) => {
                        if (item.link === browserRoutes.admin.link && !isAdmin)
                            return;
                        return (
                            <Link
                                href={item.link}
                                key={index}
                                className={`flex flex-col gap-1 items-center justify-center w-1/4 lg:w-9/10 lg:h-1/4 cursor-pointer transition-text duration-300 z-10 ${
                                    currentPage === index
                                        ? "text-card"
                                        : "text-text-muted"
                                } max-lg:text-text`}
                            >
                                <item.Icon />
                                <h1
                                    className={`lg:hidden text-xs ${currentPage === index && "text-blue-600"} transition-text duration-300`}
                                >
                                    {item.label}
                                </h1>
                            </Link>
                        );
                    })}

                    <div
                        style={{ left: `${leftPosition}%` }}
                        className={`lg:hidden absolute top-1/2 -translate-y-1/2 w-1/${tabsCount} h-8/10 bg-border-light rounded-full transition-all duration-300 pointer-events-none z-2`}
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
