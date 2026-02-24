"use client";
import { browserRoutes } from "@/consts/browserRoutes";
import logo from "@/public/logo.svg";
import { loginWithGithub } from "@/utils/firebaseFunctions";
import Image from "next/image";
import Link from "next/link";

export default function page() {
    return (
        <div className="flex flex-col w-full h-full items-center gap-2 py-6">
            <Image src={logo} alt="logo icon" width={90} height={54} />
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="flex flex-col gap-2 mt-5">
                    <h1 className="font-semibold text-xl text-text text-center">
                        Вход
                    </h1>
                    <p className="text-text-secondary font-medium text-sm text-center">
                        В DevNet можно войти только через GitHub. Если у вас ещё
                        нет аккаунта, просто зарегистрируйтесь или мы попробуем
                        автоматически создать профиль и подставить username из
                        вашего GitHub.
                    </p>
                </div>
                <button
                    className="h-12 px-12 rounded-full bg-text text-background font-medium mt-5"
                    onClick={() => loginWithGithub()}
                >
                    Войти с помощью GitHub
                </button>
                <div className="flex gap-1 font-medium text-sm mt-1">
                    <p className="text-text-secondary">Еще нет аккаута?</p>
                    <Link
                        href={browserRoutes.auth.register.link}
                        className="text-[#0080FF]"
                    >
                        Зарегистрироваться
                    </Link>
                </div>
            </div>
        </div>
    );
}
