"use client";

import { browserRoutes } from "@/consts/browserRoutes";
import logo from "@/public/logo.svg";
import {
    checkUsernameExists,
    loginWithGithub,
} from "@/utils/firebaseFunctions";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

export default function page() {
    const [username, setUsername] = useState<string>("");
    const [usernameExists, setUsernameExists] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = setTimeout(
            async () => await validateUsername(username),
            250,
        );

        return () => clearTimeout(unsubscribe);
    }, [username]);

    const handleRegister = () => {
        validateUsername(username).then(() => {
            if (error || usernameExists) return;
            loginWithGithub(username);
        });
    };

    const validateUsername = async (username: string) => {
        setError(null);
        if (username.length < 3)
            setError("username должен содержать 3 и более символов");

        const regex = /[^a-zA-Z0-9]/;
        if (regex.test(username))
            setError("username не может содержать спец. символы");

        const isUsernameExists = await checkUsernameExists(username);
        setUsernameExists(isUsernameExists);
        if (!username) setUsernameExists(true);
    };

    return (
        <div className="flex flex-col w-full h-full items-center gap-2 py-6">
            <Image src={logo} alt="logo icon" width={90} height={54} />
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="flex flex-col gap-2 mt-5">
                    <h1 className="font-semibold text-xl text-text text-center">
                        Регистрация
                    </h1>
                    <p className="text-text-secondary font-medium text-sm text-center">
                        Регистрация в DevNet доступна только через GitHub. Если
                        у вас уже есть аккаунт, просто войдите, а если нет — мы
                        автоматически создадим профиль.
                    </p>
                </div>
                <div className="flex flex-col items-start justify-center gap-1">
                    <label htmlFor="usernameInput" className="">
                        Username
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            name="usernameInput"
                            id="usernameInput"
                            placeholder="Enter your username"
                            className="p-3 w-80 ring ring-border rounded-lg outline-0 focus:ring-border-light"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {usernameExists ? (
                            <X
                                className="p-2 bg-card rounded-md text-red-500"
                                width={35}
                                height={35}
                            />
                        ) : (
                            <Check
                                className="p-2 bg-card rounded-md text-green-500"
                                width={35}
                                height={35}
                            />
                        )}
                    </div>
                </div>
                <p className="text-red-500/80 text-sm">{error}</p>
                <button
                    className="h-12 px-12 rounded-full bg-text text-background font-medium mt-5"
                    onClick={handleRegister}
                >
                    Зарегистрироваться
                </button>
                <div className="flex gap-1 font-medium text-sm mt-1">
                    <p className="text-text-secondary">Уже есть аккаут?</p>
                    <Link
                        href={browserRoutes.auth.login.link}
                        className="text-[#0080FF]"
                    >
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
}
