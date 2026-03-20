"use client";

import { IProject } from "@/interfaces/interfaces";
import { useUserProfileStore } from "@/stores/useProfileStore";
import { BookPlus } from "lucide-react";
import Repository from "../Repository";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface IProps {
    setSelectedRepo: React.Dispatch<React.SetStateAction<IProject | null>>;
}

export default function ProfileReposModal({ setSelectedRepo }: IProps) {
    const [searchValue, setSearchValue] = useState<string>("");
    const { repositories } = useUserProfileStore();

    const filteredRepos = searchValue
        ? repositories?.filter((repo) =>
              repo.repoName.toLowerCase().includes(searchValue.toLowerCase()),
          )
        : repositories;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <BookPlus
                    width={40}
                    height={40}
                    className="w-5 h-5 hover:text-text text-text-secondary transition-text duration-300"
                />
            </DialogTrigger>
            <DialogContent className="lg:h-2/3">
                <DialogHeader className="text-center font-semibold">
                    <DialogTitle>Выберите репозиторий</DialogTitle>
                </DialogHeader>
                <Field orientation="horizontal">
                    <Input
                        type="search"
                        placeholder="Поиск..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </Field>
                {repositories && filteredRepos && (
                    <ul className="flex flex-col gap-2 overflow-y-auto">
                        {filteredRepos.map((repo) => (
                            <Repository
                                repo={repo}
                                key={repo.repoId}
                                onClick={() => setSelectedRepo(repo)}
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
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button">Закрыть</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
