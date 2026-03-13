import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { formatFirestoreDate } from "@/utils/dateConverter";
import { accentMap, iconMap } from "@/utils/notificationIcons";
import { Check, Bell, Delete } from "lucide-react";
import { INotification } from "@/interfaces/interfaces";
import { Button } from "@/components/ui/button";

export default function NotificationRow({
    n,
    onToggle,
    onRemove,
}: {
    n: INotification;
    onToggle: () => void;
    onRemove: () => void;
}) {
    const Icon = iconMap[n.icon] ?? iconMap[n.type] ?? Bell;
    const accent = accentMap[n.type] ?? "bg-zinc-700/10 border-zinc-600";

    return (
        <div
            className={`flex items-start gap-4 p-4 hover:bg-background/50 transition-colors ${
                n.isRead
                    ? "opacity-80"
                    : "bg-linear-to-r from-white/1 to-white/0"
            }`}
            role="listitem"
        >
            <div
                className={`shrink-0 rounded-md p-2 border ${accent} w-11 h-11 flex items-center justify-center`}
            >
                <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                                {n.title}
                            </p>
                            {!n.isRead && (
                                <Badge variant="secondary">новое</Badge>
                            )}
                        </div>
                        {n.description && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                {n.description}
                            </p>
                        )}
                    </div>

                    <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">
                            {formatFirestoreDate(n.createdAt)}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={onToggle}
                                        aria-label="toggle-read"
                                    >
                                        <Check className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                    className="bg-white fill-transparent"
                                    side="left"
                                >
                                    <p>
                                        {n.isRead
                                            ? "Пометить как непрочитанное"
                                            : "Отметить как прочитанное"}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={onRemove}
                                    >
                                        <Delete className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                    className="bg-white fill-transparent"
                                    side="right"
                                >
                                    <p>Удалить уведомление</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
