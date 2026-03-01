"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { browserRoutes } from "@/consts/browserRoutes";
import NavBar from "@/components/NavBar";
import { setupUser } from "@/utils/firebaseFunctions";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace(browserRoutes.auth.login.link);
                window.cookieStore.delete("uid");
            } else {
                setupUser(user).then(() => {
                    setAuthorized(true);
                    window.cookieStore.set("uid", user.uid);
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) return <div>Загрузка...</div>;

    if (!authorized) return null;

    return (
        <>
            <NavBar />
            <main className="w-full max-w-175 h-full mt-2 max-lg:mx-2 lg:mt-10">
                {children}
            </main>
        </>
    );
}
