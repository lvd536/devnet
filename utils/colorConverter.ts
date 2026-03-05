export function getContrastTextColor(
    color: string | undefined,
): "#000" | "#fff" {
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
