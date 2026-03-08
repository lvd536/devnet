"use client";
import { CSSProperties, useMemo } from "react";
import type { IRole } from "@/interfaces/interfaces";
import { getContrastTextColor } from "@/utils/colorConverter";

type Variant = "solid" | "outline" | "ghost";
type Size = "xs" | "sm" | "md" | "lg";

interface RolePillProps {
    role: IRole;
    variant?: Variant;
    size?: Size;
    className?: string;
    showDot?: boolean;
    ariaLabel?: string;
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
        xs: { font: "text-[10px]", px: "px-1.5 py-0.5", dot: 6 },
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
