"use client";
import { editUserCredits } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase/firebase";
import { useUserProfileStore } from "@/stores/useProfileStore";
import { checkUsernameExists } from "@/utils/firebaseFunctions";
import { sendToast } from "@/utils/toast";
import { useCallback, useEffect, useState } from "react";

export function ProfileEdit() {
    const { profile } = useUserProfileStore();
    const entryUsername = profile?.username ?? "";

    const [displayName, setDisplayName] = useState<string>(
        profile?.githubUsername ?? "",
    );

    const [username, setUsername] = useState<string>(profile?.username ?? "");
    const [usernameExists, setUsernameExists] = useState<boolean>(
        !(profile?.username === entryUsername),
    );

    const [description, setDescription] = useState<string | "">(
        profile?.description ?? "",
    );

    const [error, setError] = useState<string | null>(null);

    const handleEdit = () => {
        validateUsername(username).then(() => {
            if (error || usernameExists) return;
            const user = auth.currentUser;
            if (!user) return;
            user.getIdToken().then(async (token) => {
                sendToast({
                    title: "Изменение профиля",
                    description: "Применяем изменения профиля",
                    position: "top-center",
                    type: "promise",
                    promise: {
                        func: () =>
                            editUserCredits(
                                token,
                                username,
                                displayName,
                                description,
                            ),
                        errorMessage: "При изменении профиля произошла ошибка",
                        loadingMessage: "Применяем изменения",
                        successMessage:
                            "Профиль успешно обновлен, можете закрыть окно",
                    },
                });
            });
        });
    };

    const validateUsername = useCallback(
        async (username: string) => {
            setError(null);

            if (username === entryUsername) return;

            if (username.length < 3) {
                setError("username должен содержать 3 и более символов");
                return;
            }

            const regex = /[^a-zA-Z0-9]/;
            if (regex.test(username)) {
                setError("username не может содержать спец. символы");
                return;
            }

            if (!username) {
                setUsernameExists(true);
                return;
            }

            const isUsernameExists = await checkUsernameExists(username);
            if (isUsernameExists) setError("Юзернейм занят");
            setUsernameExists(isUsernameExists);
        },
        [entryUsername],
    );

    useEffect(() => {
        const unsubscribe = setTimeout(
            async () => await validateUsername(username),
            250,
        );

        return () => clearTimeout(unsubscribe);
    }, [username, validateUsername]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    className="rounded-full bg-text text-background max-h-8 font-semibold text-xs"
                >
                    Редактировать
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Изменение профиля</DialogTitle>
                    <DialogDescription>
                        Измените свой профиль и нажмите кнопку сохранить
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="name-1">Отображаемое имя</Label>
                        <Input
                            id="name-1"
                            name="name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="username-1">Юзернейм</Label>
                        <Input
                            id="username-1"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="description-1">Описание</Label>
                        <Input
                            id="description-1"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Field>
                    <Field className="text-red-500 text-sm text-center">
                        {error}
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Отмена</Button>
                    </DialogClose>
                    <Button onClick={handleEdit}>Сохранить изменения</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
