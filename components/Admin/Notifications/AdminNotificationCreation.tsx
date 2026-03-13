import { addNotification } from "@/actions/notifications";
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
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INotification } from "@/interfaces/interfaces";
import { auth } from "@/lib/firebase";
import { iconMap, notificationIconKeys } from "@/utils/notificationIcons";
import { SquarePlus } from "lucide-react";
import { useState } from "react";

interface IProps {
    notifications: INotification[];
}

const initialFormData: Omit<INotification, "id" | "toUserId" | "createdAt"> = {
    title: "",
    description: "",
    icon: "system",
    isRead: false,
    type: "system",
} as const;

type FormDataType = typeof initialFormData;

export default function AdminNotificationCreation({ notifications }: IProps) {
    const [formData, setFormData] = useState<FormDataType>(initialFormData);
    const [error, setError] = useState<string | null>(null);

    const SelectedIcon = iconMap[formData.icon];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const user = auth.currentUser;
        if (!user) {
            setError("Unauthorized");
            return;
        }

        const notificationToAdd: Omit<INotification, "id" | "createdAt"> = {
            ...formData,
            toUserId: "system",
        };
        addNotification(notificationToAdd)
            .then(() => setFormData(initialFormData))
            .catch((err) => setError(String(err?.message ?? err)));
    };

    if (!notifications) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center justify-center"
                >
                    <SquarePlus />
                    Добавить уведомление
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Создание уведомления</DialogTitle>
                        <DialogDescription>
                            Оповестите пользователей о чем-то новом или
                            серьезном
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="my-4">
                        <Field>
                            <Label htmlFor="title">Заголовок</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="title">Описание</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </Field>
                        <Field className="flex gap-2 items-center justify-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex gap-2 items-center justify-between cursor-pointer px-3 py-2 rounded-md border">
                                        <span className="text-sm font-medium">
                                            Иконка
                                        </span>
                                        <SelectedIcon />
                                    </div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="bg-background">
                                    {notificationIconKeys.map((key) => {
                                        const Icon = iconMap[key];
                                        return (
                                            <DropdownMenuItem
                                                key={key}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800"
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        icon: key,
                                                        type: key,
                                                    }))
                                                }
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-sm">
                                                    {key}
                                                </span>
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Field>
                    </FieldGroup>
                    {error && (
                        <Field className="text-red-500 text-sm text-center mb-4">
                            {error}
                        </Field>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Отмена</Button>
                        </DialogClose>
                        <Button type="submit">Создать</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
