import { addBadge } from "@/actions/badges";
import { Badge } from "@/components/Badge";
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
    DropdownMenuGroup,
    DropdownMenuCheckboxItem,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IBadge } from "@/interfaces/interfaces";
import { auth } from "@/lib/firebase/firebase";
import { badgeIconKeys, badgeIcons } from "@/utils/badgeIcons";
import { SquarePlus } from "lucide-react";
import { useState } from "react";

const badgeRarities: IBadge["rarity"][] = [
    "common",
    "epic",
    "legendary",
    "rare",
];

interface IProps {
    badges: IBadge[];
}

const initialFormData: IBadge = {
    id: "",
    title: "",
    description: "",
    icon: "github",
    rarity: "common",
    createdAt: new Date().getTime(),
} as const;

export default function AdminBadgeCreation({ badges }: IProps) {
    const [formData, setFormData] = useState<IBadge>(initialFormData);
    const [error, setError] = useState<string | null>(null);

    const SelectedIcon = badgeIcons[formData.icon];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const user = auth.currentUser;
        if (!user) {
            setError("Unauthorized");
            return;
        }

        const isBadgeIdExists = badges.some(
            (badge) => formData.id === badge.id,
        );
        if (isBadgeIdExists) {
            setError("Badge name already exists");
            return;
        }

        const badgeToAdd = { ...formData, id: formData.id };
        user.getIdToken().then((token) => {
            addBadge(token, badgeToAdd)
                .then(() => setFormData(initialFormData))
                .catch((err) => setError(String(err?.message ?? err)));
        });
    };

    if (!badges) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center justify-center"
                >
                    <SquarePlus />
                    Добавить бейдж
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Создание бейджика</DialogTitle>
                        <DialogDescription>
                            Создайте новый бейджик и нажмите кнопку сохранить
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="my-4">
                        <Field>
                            <Label htmlFor="name">Название</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.id}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        id: e.target.value,
                                    }))
                                }
                            />
                        </Field>
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
                                    <div className="flex gap-2 items-center justify-between">
                                        <Label>Редкость</Label>
                                        <Label>{formData.rarity}</Label>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="sm:max-w-xs">
                                    <DropdownMenuGroup className="bg-background">
                                        {badgeRarities.map((rarity) => (
                                            <DropdownMenuCheckboxItem
                                                checked={
                                                    formData.rarity === rarity
                                                }
                                                onCheckedChange={(checked) => {
                                                    if (!checked) return;
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        rarity: rarity,
                                                    }));
                                                }}
                                                key={`rarity-${rarity}`}
                                            >
                                                {rarity}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Field>
                        <Field className="flex gap-2 items-center justify-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex gap-2 items-center justify-between cursor-pointer px-3 py-2 rounded-md border">
                                        <span className="text-sm font-medium">
                                            Иконка
                                        </span>
                                        <Badge
                                            icon={SelectedIcon}
                                            rarity={formData.rarity}
                                            title={formData.title}
                                            description={formData.description}
                                        />
                                    </div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="bg-background">
                                    {badgeIconKeys.map((key) => {
                                        const Icon = badgeIcons[key];
                                        return (
                                            <DropdownMenuItem
                                                key={key}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800"
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        icon: key,
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
