import { IRole } from "@/interfaces/interfaces";

export const ROLE_PERMISSIONS: IRole["permissions"] = [
    "admin",
    "moderator",
] as const;
