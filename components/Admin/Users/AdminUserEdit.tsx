import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm, Path } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { IRole, IUserProfile } from "@/interfaces/interfaces";
import { checkUsernameExists } from "@/utils/firebaseFunctions";
import { Field, FieldGroup } from "@/components/ui/field";
import useRoles from "@/hooks/useRoles";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import RolePill from "@/components/RolePill";

interface Props {
    user: IUserProfile;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type FormData = Omit<IUserProfile, "id" | "createdAt" | "lastSyncAt">;

function removeUndefined(obj: object) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined),
    );
}

export default function AdminUserEdit({ user, open, onOpenChange }: Props) {
    const { loading, roles, error: rolesError } = useRoles();
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, reset, control } = useForm<FormData>({
        defaultValues: user as IUserProfile,
    });

    const entryUsername = user.username;

    const validateUsername = async (username: string) => {
        setError(null);
        if (username.length < 3) {
            setError("username должен содержать 3 и более символов");
            return false;
        }

        const regex = /[^a-zA-Z0-9]/;
        if (regex.test(username)) {
            setError("username не может содержать спец. символы");
            return false;
        }
        const isUsernameExists =
            username === entryUsername
                ? false
                : await checkUsernameExists(username);
        if (!isUsernameExists) return true;
        if (isUsernameExists) {
            setError("Пользователь занят");
            return false;
        }
        return false;
    };

    useEffect(() => {
        reset(user);
    }, [user, reset]);

    async function onSubmit(values: FormData) {
        try {
            if (!values.username) return;

            const isUsernameValid = await validateUsername(values.username);
            if (!isUsernameValid) return;

            const ref = doc(db, "users", user.id);
            await setDoc(ref, removeUndefined(values), { merge: true });
            onOpenChange(false);
        } catch (err) {
            console.error("Ошибка при обновлении пользователя:", err);
        }
    }

    if (loading) return <div>Загрузка...</div>;

    if (!user || rolesError || !roles) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактирование пользователя</DialogTitle>
                    <DialogDescription>
                        Панель редактирование пользователя
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="githubUsername">
                                GitHub username
                            </Label>
                            <Input
                                id="githubUsername"
                                {...register("githubUsername")}
                                type="text"
                                defaultValue={user.githubUsername || ""}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                {...register("username")}
                                type="text"
                                defaultValue={user.username}
                            />
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Edit stats</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Stats edit</DialogTitle>
                            <FieldGroup>
                                <div className="grid grid-cols-2 gap-3">
                                    {(
                                        Object.entries(user.stats) as [
                                            keyof IUserProfile["stats"],
                                            number,
                                        ][]
                                    ).map(([label, value]) => (
                                        <div
                                            className="grid gap-3"
                                            key={String(label)}
                                        >
                                            <Label htmlFor={`stat-${label}`}>
                                                {label}
                                            </Label>
                                            <Input
                                                id={`stat-${label}`}
                                                {...register(
                                                    `stats.${label}` as Path<FormData>,
                                                )}
                                                type="number"
                                                defaultValue={value}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </FieldGroup>
                        </DialogContent>
                    </Dialog>

                    <Field>
                        <Label>Гл.Роль</Label>
                        <Controller
                            control={control}
                            name="role"
                            render={({ field }) => {
                                const selectedRole = field.value;

                                return (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost">
                                                    <RolePill
                                                        role={selectedRole}
                                                        variant="outline"
                                                        size="sm"
                                                        showDot={false}
                                                    />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className="sm:max-w-xs bg-background">
                                                <DropdownMenuGroup>
                                                    {roles.map((role) => (
                                                        <DropdownMenuItem
                                                            key={role.id}
                                                            onClick={() => {
                                                                if (
                                                                    selectedRole.id ===
                                                                    role.id
                                                                )
                                                                    return;
                                                                field.onChange(
                                                                    role,
                                                                );
                                                            }}
                                                        >
                                                            {role.name}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                );
                            }}
                        />
                    </Field>

                    <Field>
                        <Label>Роли</Label>
                        <Controller
                            control={control}
                            name="roles"
                            render={({ field }) => {
                                const selectedRoles = field.value || [];

                                return (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {selectedRoles.map(
                                            (role: IRole, index: number) => (
                                                <div
                                                    className="text-sm"
                                                    key={`selected-role-${index}`}
                                                    onClick={() =>
                                                        field.onChange(
                                                            selectedRoles.filter(
                                                                (r) =>
                                                                    r.id !==
                                                                    role.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <RolePill
                                                        role={role}
                                                        variant="outline"
                                                        size="sm"
                                                        showDot={false}
                                                    />
                                                </div>
                                            ),
                                        )}

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <div className="flex items-center justify-between gap-2 cursor-pointer">
                                                    <Plus
                                                        width={20}
                                                        height={20}
                                                        className="rounded-full p-1 bg-text-muted/30"
                                                    />
                                                </div>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className="sm:max-w-xs bg-background">
                                                <DropdownMenuGroup>
                                                    {roles.map(
                                                        (role, index) => (
                                                            <DropdownMenuItem
                                                                key={`role-${index}`}
                                                                onClick={() => {
                                                                    if (
                                                                        selectedRoles.find(
                                                                            (
                                                                                r,
                                                                            ) =>
                                                                                r.id ===
                                                                                role.id,
                                                                        )
                                                                    )
                                                                        return;
                                                                    field.onChange(
                                                                        [
                                                                            ...selectedRoles,
                                                                            role,
                                                                        ],
                                                                    );
                                                                }}
                                                            >
                                                                {role.name}
                                                            </DropdownMenuItem>
                                                        ),
                                                    )}
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                );
                            }}
                        />
                    </Field>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}
                    <DialogFooter className="pt-4 sm:flex-col">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
