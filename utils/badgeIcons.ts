import type { LucideIcon } from "lucide-react";
import { Star, Heart, Crown, Github, Zap, MessageCircle } from "lucide-react";

export const badgeIcons: Record<string, LucideIcon> = {
    star: Star,
    heart: Heart,
    crown: Crown,
    github: Github,
    zap: Zap,
    message: MessageCircle,
};

export const badgeIconKeys = Object.keys(badgeIcons);
