import { addRole } from "@/actions/roles";
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
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_PERMISSIONS } from "@/consts/rolePermissions";
import { IRole } from "@/interfaces/interfaces";
import { auth } from "@/lib/firebase/firebase";
import { Plus, SquarePlus } from "lucide-react";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface IProps {
    roles: IRole[];
}

const initialFormData: IRole = {
    id: "",
    color: "#fff",
    name: "New role",
    permissions: ["admin"],
    priority: 0,
    createdAt: new Date().getTime(),
} as const;

export default function AdminRoleCreation({ roles }: IProps) {
    const [formData, setFormData] = useState<IRole>(initialFormData);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const user = auth.currentUser;
        if (!user) {
            setError("Unauthorized");
            return;
        }

        const isRoleNameExists = roles.some(
            (role) => formData.name === role.id,
        );
        if (isRoleNameExists) {
            setError("Role name already exists");
            return;
        }

        const roleToAdd = { ...formData, id: formData.name };
        user.getIdToken().then((token) => {
            addRole(token, roleToAdd)
                .then(() => setFormData(initialFormData))
                .catch((err) => setError(String(err?.message ?? err)));
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center justify-center"
                >
                    <SquarePlus />
                    Добавить роль
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Создание роли</DialogTitle>
                        <DialogDescription>
                            Создайте новую роль и нажмите кнопку сохранить
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="my-4">
                        <Field>
                            <Label htmlFor="name">Название</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </Field>
                        <Field className="flex gap-2 items-center justify-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex gap-2 items-center justify-between">
                                        <Label>Цвет</Label>
                                        <div
                                            className="min-w-5 min-h-5 max-w-5 max-h-5 rounded-sm"
                                            style={{
                                                backgroundColor: formData.color,
                                            }}
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="sm:max-w-xs">
                                    <FieldGroup className="w-full self-center flex items-center justify-center">
                                        <section className="picker">
                                            <HexColorPicker
                                                color={formData.color}
                                                onChange={(e) =>
                                                    setFormData((perv) => ({
                                                        ...perv,
                                                        color: e,
                                                    }))
                                                }
                                            />
                                        </section>
                                    </FieldGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Field>
                        <Field>
                            <Label>Привелегии</Label>
                            <div className="flex flex-wrap items-center gap-2">
                                {formData.permissions.map((perm, index) => (
                                    <p
                                        className="text-sm px-3 py-1 bg-card rounded-full"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                permissions:
                                                    prev.permissions.filter(
                                                        (p) => p !== perm,
                                                    ),
                                            }))
                                        }
                                        key={`selected-perm-${index}`}
                                    >
                                        {perm}
                                    </p>
                                ))}
                                <div className="flex gap-2 items-center justify-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center justify-between gap-2">
                                                <Plus
                                                    width={20}
                                                    height={20}
                                                    className="rounded-full p-1 bg-text-muted/30"
                                                />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="sm:max-w-xs bg-background">
                                            <DropdownMenuGroup>
                                                {ROLE_PERMISSIONS.filter(
                                                    (perm) =>
                                                        !formData.permissions.some(
                                                            (p) => p === perm,
                                                        ),
                                                ).map((perm, index) => (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    permissions:
                                                                        [
                                                                            ...prev.permissions,
                                                                            perm,
                                                                        ],
                                                                }),
                                                            )
                                                        }
                                                        key={`permission-${index}`}
                                                    >
                                                        {perm}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </Field>
                        <Field>
                            <Label htmlFor="priority">Приоритет</Label>
                            <Input
                                id="priority"
                                name="priority"
                                type="number"
                                value={formData.priority}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        priority: +e.target.value,
                                    }))
                                }
                            />
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
