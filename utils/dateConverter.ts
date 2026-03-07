import { Timestamp } from "firebase/firestore";

function parseFirestoreDate(value: unknown): Date | null {
    if (!value) return null;

    if (value instanceof Timestamp) {
        return value.toDate();
    }

    if (typeof value === "object" && value !== null && "toDate" in value) {
        try {
            return (value as { toDate: () => Date }).toDate();
        } catch {
            return null;
        }
    }

    if (typeof value === "number") {
        return new Date(value);
    }

    if (typeof value === "string") {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }

    return null;
}

export function formatFirestoreDate(value: unknown): string {
    const date = parseFirestoreDate(value);

    if (!date) return "—";

    return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
