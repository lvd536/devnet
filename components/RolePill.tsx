"use client";
import { CSSProperties, useMemo } from "react";
import type { IRole } from "@/interfaces/interfaces";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface RolePillProps {
    role: IRole;
    variant?: Variant;
    size?: Size;
    className?: string;
    showDot?: boolean;
    ariaLabel?: string;
}

function getContrastTextColor(color: string | undefined): "#000" | "#fff" {
    if (!color) return "#fff";

    const hexMatch = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        let hex = hexMatch[1];
        if (hex.length === 3) {
            hex = hex
                .split("")
                .map((c) => c + c)
                .join("");
        }
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.6 ? "#000" : "#fff";
    }

    const rgbMatch = color.match(/rgba?\(([^)]+)\)/i);
    if (rgbMatch) {
        const parts = rgbMatch[1].split(",").map((s) => parseFloat(s));
        const [r, g, b] = parts;
        if ([r, g, b].every((v) => typeof v === "number" && !isNaN(v))) {
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.6 ? "#000" : "#fff";
        }
    }

    return "#fff";
}

export default function RolePill({
    role,
    variant = "solid",
    size = "md",
    className = "",
    showDot = true,
}: RolePillProps) {
    const color = role?.color ?? "#8b5cf6";
    const textColor = useMemo(() => getContrastTextColor(color), [color]);

    const sizes: Record<Size, { font: string; px: string; dot: number }> = {
        sm: { font: "text-xs", px: "px-2 py-0.5", dot: 8 },
        md: { font: "text-sm", px: "px-3 py-1", dot: 10 },
        lg: { font: "text-base", px: "px-4 py-1.5", dot: 12 },
    };

    const s = sizes[size];

    const style: CSSProperties =
        variant === "solid"
            ? {
                  background: color,
                  color: textColor,
              }
            : variant === "outline"
              ? {
                    background: "transparent",
                    color: color,
                    border: `1px solid ${color}`,
                }
              : {
                    background: "transparent",
                    color: color,
                };

    const dotStyle: CSSProperties =
        variant === "solid"
            ? {
                  background: textColor,
                  width: s.dot,
                  height: s.dot,
                  borderRadius: 9999,
              }
            : {
                  background: color,
                  width: s.dot,
                  height: s.dot,
                  borderRadius: 9999,
              };

    return (
        <span
            title={role?.name}
            style={style}
            className={`inline-flex items-center gap-2 rounded-full font-semibold ${s.font} ${s.px} ${className}`}
        >
            {showDot && (
                <span aria-hidden style={dotStyle} className="shrink-0" />
            )}
            <span className="leading-none">{role?.name}</span>
        </span>
    );
}
