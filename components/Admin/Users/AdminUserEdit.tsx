import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, Path } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IUserProfile } from "@/interfaces/interfaces";
import { checkUsernameExists } from "@/utils/firebaseFunctions";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type DeepPartial<T> = T extends Function
    ? T
    : T extends Array<infer U>
      ? DeepPartial<U>[]
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T;

function isPlainObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

function getDotPaths(
    obj: unknown,
    prefix = "",
    excludeKeys = new Set<string>(),
): string[] {
    if (!isPlainObject(obj)) return [];
    const paths: string[] = [];

    for (const key of Object.keys(obj)) {
        const low = key.toLowerCase();
        if (excludeKeys.has(low)) continue;
        const val = (obj as Record<string, unknown>)[key];
        const path = prefix ? `${prefix}.${key}` : key;

        if (isPlainObject(val)) {
            paths.push(...getDotPaths(val, path, excludeKeys));
        } else {
            paths.push(path);
        }
    }

    return paths;
}

function getByPath<T = unknown>(obj: unknown, path: string): T | undefined {
    if (!path) return undefined;
    let cur: unknown = obj;

    for (const part of path.split(".")) {
        if (!isPlainObject(cur)) return undefined;
        cur = (cur as Record<string, unknown>)[part];
    }

    return cur as T | undefined;
}

function coercePayloadTypes(payload: unknown, example: unknown): unknown {
    if (payload == null) return payload;

    if (typeof example === "number" && typeof payload === "string") {
        const n = Number(payload);
        return Number.isNaN(n) ? payload : n;
    }

    if (typeof example === "boolean" && typeof payload === "string") {
        if (payload === "true") return true;
        if (payload === "false") return false;
        return Boolean(payload);
    }

    if (Array.isArray(payload)) {
        if (!Array.isArray(example)) return payload;
        return payload.map((p, i) =>
            coercePayloadTypes(p, (example as unknown[])[i]),
        );
    }

    if (isPlainObject(payload)) {
        const out: Record<string, unknown> = {};
        for (const k of Object.keys(payload)) {
            out[k] = coercePayloadTypes(
                (payload as Record<string, unknown>)[k],
                isPlainObject(example)
                    ? (example as Record<string, unknown>)[k]
                    : undefined,
            );
        }
        return out;
    }

    return payload;
}

interface Props {
    user: IUserProfile;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AdminUserEdit({ user, open, onOpenChange }: Props) {
    const [error, setError] = useState<string | null>(null);

    const exclude = new Set(["id", "createdat", "lastsyncat", "role"]);
    const fields = getDotPaths(user, "", exclude);

    const { register, handleSubmit, reset } = useForm<
        DeepPartial<IUserProfile>
    >({
        defaultValues: user as DeepPartial<IUserProfile>,
    });

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
        const isUsernameExists = await checkUsernameExists(username);
        if (!isUsernameExists) return true;
        if (isUsernameExists) {
            setError("Пользователь занят");
            return false;
        }
        return false;
    };

    useEffect(() => {
        reset(user as DeepPartial<IUserProfile>);
    }, [user, reset]);

    async function onSubmit(values: DeepPartial<IUserProfile>) {
        try {
            const coerced = coercePayloadTypes(
                values,
                user,
            ) as Partial<IUserProfile>;
            if (!coerced.username) return;

            const isUsernameValid = await validateUsername(coerced.username);
            if (!isUsernameValid) return;

            const ref = doc(db, "users", user.id);
            await setDoc(ref, coerced, { merge: true });
            onOpenChange(false);
        } catch (err) {
            console.error("Ошибка при обновлении пользователя:", err);
        }
    }

    if (!user) return null;

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
                        {fields.map((path) => {
                            const label = path.split(".").slice(-1)[0];
                            const exampleVal = getByPath(user, path);
                            const type =
                                typeof exampleVal === "number"
                                    ? "number"
                                    : label.toLowerCase().includes("email")
                                      ? "email"
                                      : label.toLowerCase().includes("password")
                                        ? "password"
                                        : "text";
                            return (
                                <div className="grid gap-3" key={path}>
                                    <Label htmlFor={path}>{label}</Label>
                                    <Input
                                        id={path}
                                        {...register(
                                            path as Path<
                                                DeepPartial<IUserProfile>
                                            >,
                                        )}
                                        type={type}
                                        defaultValue={
                                            getByPath(user, path) as string
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
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
