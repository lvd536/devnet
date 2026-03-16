export function calculateNextLevelXP(level: number) {
    const baseXP = 100;

    return Math.floor(baseXP * Math.pow(level + 1, 2));
}
