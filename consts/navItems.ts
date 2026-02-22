import { House, UserRound, Search, Bell, type LucideIcon } from "lucide-react";

export const NAV_ITEMS: { Icon: LucideIcon; label: string }[] = [
    {
        Icon: House,
        label: "Лента",
    },
    {
        Icon: Search,
        label: "Поиск",
    },
    {
        Icon: Bell,
        label: "Уведомления",
    },
    {
        Icon: UserRound,
        label: "Профиль",
    },
] as const;
