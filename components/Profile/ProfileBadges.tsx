import useUserBadges from "@/hooks/useUserBadges";
import { Badge } from "../Badge";
import { badgeIcons } from "@/utils/badgeIcons";
import useBadges from "@/hooks/useBadges";
import { Flame } from "lucide-react";
import { ProfileBadgesSkeleton } from "../Skeletons/Profile/ProfileBadgesSkeleton";

interface IProps {
    userId: string;
    streak?: number;
}

export default function ProfileBadges({ userId, streak }: IProps) {
    const {
        userBadges,
        loading: userBadgesLoading,
        error: userBadgesError,
    } = useUserBadges({ userId });
    const { badges, loading: badgesLoading, error: badgesError } = useBadges();

    if (userBadgesLoading || badgesLoading)
        return <ProfileBadgesSkeleton count={4} />;

    if (userBadgesError || badgesError || !userBadges || !badges) return null;

    return (
        <div className="flex gap-2 mt-3 flex-wrap">
            {userBadges.map((badge) => {
                const targetBadge = badges.find((b) => b.id === badge.id)!;
                const Icon = badgeIcons[targetBadge.icon];
                return (
                    <Badge
                        key={badge.id}
                        icon={Icon}
                        description={targetBadge.description}
                        rarity={targetBadge.rarity}
                        title={targetBadge.title}
                        size="sm"
                    />
                );
            })}
            {streak && (
                <Badge
                    key={"streak-badge"}
                    icon={Flame}
                    description={
                        "Посещайте нас каждый день и увеличивайте серию!"
                    }
                    rarity={
                        streak > 30
                            ? "rare"
                            : streak > 50
                              ? "epic"
                              : streak > 100
                                ? "legendary"
                                : "common"
                    }
                    title={`Серия - ${streak}`}
                    size="sm"
                    color="#FF4500"
                />
            )}
        </div>
    );
}
