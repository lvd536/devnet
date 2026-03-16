"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { browserRoutes } from "@/consts/browserRoutes";
import { setupUser } from "@/utils/firebaseFunctions";

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
                setupUser(user).then(() => {
                    router.replace(browserRoutes.home.link);
                    window.cookieStore.set("uid", user.uid);
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) return <div>Загрузка...</div>;

    return (
        <>
            <main className="w-full lg:w-175 h-full">{children}</main>
        </>
    );
}
