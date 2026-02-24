"use client";

import { IProject } from "@/interfaces/interfaces";
import { useUserProfileStore } from "@/stores/useProfileStore";
import { X } from "lucide-react";
import Repository from "../Repository";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    setSelectedRepo: React.Dispatch<React.SetStateAction<IProject | null>>;
}

export default function ProfileReposModal({
    isOpen,
    onClose,
    setSelectedRepo,
}: IProps) {
    const { repositories } = useUserProfileStore();

    if (!isOpen) return null;

    return (
        <div className="flex w-full h-full fixed top-0 left-0 bg-black/50 items-center justify-center z-90">
            <div className="relative bg-background rounded-xl lg:w-1/2 lg:h-1/2 p-2 overflow-y-auto">
                <X
                    className="absolute right-2 top-2 text-red-500"
                    onClick={onClose}
                />
                <h1 className="text-center font-semibold">
                    Выберите репозиторий
                </h1>
                {repositories && (
                    <ul className="flex flex-col gap-2 mt-2">
                        {repositories.map((repo) => (
                            <Repository
                                repo={repo}
                                key={repo.repoId}
                                onClick={() => {
                                    setSelectedRepo(repo);
                                    onClose();
                                }}
                            />
                        ))}
                    </ul>
                )}
                {!repositories && (
                    <p className="text-text-secondary text-center">
                        Нет отслеживаемых репозиториев. Синхронизируйте
                        репозитории с GitHub в профиле или добавьте свой первый
                        репозиторий в GitHub
                    </p>
                )}
            </div>
        </div>
    );
}
