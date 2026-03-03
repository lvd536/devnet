import { House, UserRound, Search, Bell, type LucideIcon } from "lucide-react";
import { browserRoutes } from "./browserRoutes";

export const NAV_ITEMS: { Icon: LucideIcon; label: string; link: string }[] = [
    {
        Icon: House,
        label: "Лента",
        link: browserRoutes.home.link,
    },
    {
        Icon: Search,
        label: "Поиск",
        link: browserRoutes.explore.link,
    },
    {
        Icon: Bell,
        label: "Уведомления",
        link: browserRoutes.notifications.link,
    },
    {
        Icon: UserRound,
        label: "Профиль",
        link: browserRoutes.profile.link,
    },
    {
        Icon: UserRound,
        label: "Админ",
        link: browserRoutes.admin.link,
    },
] as const;
