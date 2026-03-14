import { calculateNextLevelXP } from "@/utils/firebaseFunctions";

interface IProps {
    level: number;
    xp: number;
}

export default function ProfileExpBar({ level, xp }: IProps) {
    const nextLevelAt = calculateNextLevelXP(level);
    const levelReachPercent = ((xp / nextLevelAt) * 100).toFixed(1);
    return (
        <div className="mt-3 w-full">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
                <div>
                    XP {xp} / {nextLevelAt}
                </div>
                <div>{levelReachPercent}%</div>
            </div>
            <div className="w-full bg-accent h-2 rounded-full overflow-hidden">
                <div
                    className="h-2 rounded-full bg-linear-to-r from-purple-500 to-indigo-500"
                    style={{ width: `${levelReachPercent}%` }}
                ></div>
            </div>
        </div>
    );
}
