import useUserBadges from "@/hooks/useUserBadges";
import { Badge } from "../Badge";
import { badgeIcons } from "@/utils/badgeIcons";
import useBadges from "@/hooks/useBadges";

interface IProps {
    userId: string;
}

export default function ProfileBadges({ userId }: IProps) {
    const {
        userBadges,
        loading: userBadgesLoading,
        error: userBadgesError,
    } = useUserBadges({ userId });
    const { badges, loading: badgesLoading, error: badgesError } = useBadges();
    if (userBadgesLoading || badgesLoading) return <div>Загрузка...</div>;

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
        </div>
    );
}
