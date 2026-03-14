import { IBadge } from "@/interfaces/interfaces";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { type LucideIcon } from "lucide-react";

interface IProps {
    icon: LucideIcon;
    rarity: IBadge["rarity"];
    title: string;
    description: string;
    size?: "sm" | "md" | "lg";
    color?: string;
}

export function Badge({
    icon: Icon,
    rarity,
    title,
    description,
    size,
    color,
}: IProps) {
    const rarityStyles = {
        common: "bg-zinc-800 border-zinc-600",
        rare: "bg-blue-900 border-blue-500",
        epic: "bg-purple-900 border-purple-500",
        legendary: "bg-yellow-900 border-yellow-400",
    };

    return (
        <HoverCard openDelay={10} closeDelay={100}>
            <HoverCardTrigger asChild>
                <div
                    className={`
              ${size === "sm" ? "w-8 h-8" : size === "md" ? "w-10 h-10" : size === "lg" ? "w-12 h-12" : "w-10 h-10"}
              flex items-center justify-center
              rounded-lg
              border
              ${rarityStyles[rarity]}
              ${rarity === "legendary" && "animate-pulse"}
            `}
                >
                    <Icon
                        size={size === "sm" ? 18 : 20}
                        color={color ?? "white"}
                    />
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-64 flex-col gap-0.5 bg-background">
                <div className="flex gap-4 items-center justify-start">
                    <div
                        className={`
                  shrink-0
                  w-10 h-10
                  flex items-center justify-center
                  rounded-lg
                  border
                  ${rarityStyles[rarity]}
                  ${rarity === "legendary" && "animate-pulse"}
                `}
                    >
                        <Icon size={20} color={color} />
                    </div>
                    <div className="flex flex-col justify-center">
                        <p>{title}</p>
                        <p className="text-xs text-text-secondary">
                            {description}
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
