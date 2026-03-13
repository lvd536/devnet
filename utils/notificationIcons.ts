import {
    Heart,
    MessageSquare,
    User,
    Award,
    Bell,
    AlertCircle,
    XCircle,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const iconMap: Record<string, React.ComponentType<any>> = {
    like: Heart,
    comment: MessageSquare,
    follow: User,
    badge: Award,
    system: Bell,
    alert: AlertCircle,
    error: XCircle,
};

export const accentMap: Record<string, string> = {
    like: "bg-rose-600/10 border-rose-600",
    comment: "bg-sky-600/10 border-sky-600",
    follow: "bg-green-600/10 border-green-600",
    badge: "bg-violet-600/10 border-violet-600",
    system: "bg-zinc-700/10 border-zinc-500",
    alert: "bg-amber-600/10 border-amber-600",
    error: "bg-red-700/10 border-red-700",
};
