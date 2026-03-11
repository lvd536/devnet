import { addBanner } from "@/actions/banners";
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
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IBanner } from "@/interfaces/interfaces";
import { auth } from "@/lib/firebase";
import { SquarePlus } from "lucide-react";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface IProps {
    banners: IBanner[];
}

type Condition = {
    object:
        | "posts"
        | "likesGiven"
        | "likesReceived"
        | "comments"
        | "followers"
        | "follows"
        | "streak";
    bracket: "<" | ">" | "=";
    value: number;
};

const initialFormData: IBanner = {
    id: "",
    title: "",
    description: "",
    colors: {
        gradientA: "#7c3aed",
        gradientB: "#4f46e5",
    },
    condition: "",
    createdAt: new Date().getTime(),
} as const;

const initialConditionData: Condition = {
    object: "posts",
    bracket: ">",
    value: 20,
} as const;

const conditionObjects: Condition["object"][] = [
    "comments",
    "followers",
    "follows",
    "likesGiven",
    "likesReceived",
    "posts",
    "streak",
] as const;

const conditionBrackets: Condition["bracket"][] = [">", "=", "<"] as const;

export default function AdminBannerCreation({ banners }: IProps) {
    const [formData, setFormData] = useState<IBanner>(initialFormData);
    const [condition, setCondition] = useState<Condition>(initialConditionData);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const user = auth.currentUser;
        if (!user) {
            setError("Unauthorized");
            return;
        }
        const isBannerIdExists = banners.some(
            (banner) => formData.id === banner.id,
        );
        if (isBannerIdExists) {
            setError("Badge name already exists");
            return;
        }

        const bannerToAdd = {
            ...formData,
            id: formData.id,
            condition: `${condition.object}${condition.bracket}${condition.value}`,
        };
        user.getIdToken().then((token) => {
            addBanner(token, bannerToAdd)
                .then(() => setFormData(initialFormData))
                .catch((err) => setError(String(err?.message ?? err)));
        });
    };

    if (!banners) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center justify-center"
                >
                    <SquarePlus />
                    Добавить баннер
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Создание баннера</DialogTitle>
                        <DialogDescription>
                            Создайте новый баннер и нажмите кнопку сохранить
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
                        <Field className="grid grid-cols-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex flex-col items-start justify-center gap-3">
                                        <Label htmlFor="value">Объект</Label>
                                        <Button
                                            variant="outline"
                                            className="max-sm:max-w-20 max-w-32 text-xs"
                                        >
                                            {condition.object}
                                        </Button>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-fit bg-card">
                                    <DropdownMenuGroup>
                                        <DropdownMenuRadioGroup
                                            value={condition.object}
                                            onValueChange={(e) =>
                                                setCondition((prev) => ({
                                                    ...prev,
                                                    object: e as Condition["object"],
                                                }))
                                            }
                                        >
                                            {conditionObjects.map(
                                                (obj, index) => (
                                                    <DropdownMenuRadioItem
                                                        value={obj}
                                                        key={`object-${index}`}
                                                    >
                                                        {obj}
                                                    </DropdownMenuRadioItem>
                                                ),
                                            )}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex flex-col items-start justify-center gap-3">
                                        <Label htmlFor="value">Условие</Label>
                                        <Button
                                            variant="outline"
                                            className="max-sm:max-w-20 max-w-32"
                                        >
                                            {condition.bracket}
                                        </Button>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-32 bg-card">
                                    <DropdownMenuGroup>
                                        <DropdownMenuRadioGroup
                                            value={condition.bracket}
                                            onValueChange={(e) =>
                                                setCondition((prev) => ({
                                                    ...prev,
                                                    bracket:
                                                        e as Condition["bracket"],
                                                }))
                                            }
                                        >
                                            {conditionBrackets.map(
                                                (bracket, index) => (
                                                    <DropdownMenuRadioItem
                                                        value={bracket}
                                                        key={`bracket-${index}`}
                                                    >
                                                        {bracket}
                                                    </DropdownMenuRadioItem>
                                                ),
                                            )}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Field>
                                <Label htmlFor="value">Значение</Label>
                                <Input
                                    id="value"
                                    name="value"
                                    type="number"
                                    value={condition.value}
                                    onChange={(e) =>
                                        setCondition((prev) => ({
                                            ...prev,
                                            value: +e.target.value,
                                        }))
                                    }
                                />
                            </Field>
                        </Field>
                        <Field
                            className="w-full h-40 rounded-lg"
                            style={{
                                background: `linear-gradient(to right, ${formData.colors.gradientA}, ${formData.colors.gradientB})`,
                            }}
                        />
                        <Field className="flex flex-row gap-2 items-center justify-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex gap-2 items-center justify-between">
                                        <Label>Цвет A</Label>
                                        <div
                                            className="min-w-5 min-h-5 max-w-5 max-h-5 rounded-sm"
                                            style={{
                                                backgroundColor:
                                                    formData.colors.gradientA,
                                            }}
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="sm:max-w-xs">
                                    <FieldGroup className="w-full self-center flex items-center justify-center">
                                        <section className="picker">
                                            <HexColorPicker
                                                color={
                                                    formData.colors.gradientA
                                                }
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        colors: {
                                                            ...prev.colors,
                                                            gradientA: e,
                                                        },
                                                    }))
                                                }
                                            />
                                        </section>
                                    </FieldGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex gap-2 items-center justify-between">
                                        <Label>Цвет B</Label>
                                        <div
                                            className="min-w-5 min-h-5 max-w-5 max-h-5 rounded-sm"
                                            style={{
                                                backgroundColor:
                                                    formData.colors.gradientB,
                                            }}
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="sm:max-w-xs">
                                    <FieldGroup className="w-full self-center flex items-center justify-center">
                                        <section className="picker">
                                            <HexColorPicker
                                                color={
                                                    formData.colors.gradientB
                                                }
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        colors: {
                                                            ...prev.colors,
                                                            gradientB: e,
                                                        },
                                                    }))
                                                }
                                            />
                                        </section>
                                    </FieldGroup>
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
