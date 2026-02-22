"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { browserRoutes } from "@/consts/browserRoutes";
import NavBar from "@/components/NavBar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace(browserRoutes.home.link);
                window.cookieStore.set("uid", user.uid);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <NavBar />
            <main className="w-full lg:w-[700px] h-full">{children}</main>
        </>
    );
}
