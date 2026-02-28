import { IUserSummary } from "@/interfaces/interfaces";
import {
    getFollowersLimited,
    getFollowingLimited,
} from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

interface IProps {
    currentUserId: string;
    targetUserId: string;
}

export default function useProfileMeta({
    currentUserId,
    targetUserId,
}: IProps) {
    const [followers, setFollowers] = useState<IUserSummary[] | undefined>(
        undefined,
    );
    const [followings, setFollowings] = useState<IUserSummary[] | undefined>(
        undefined,
    );
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            const [followersRes, followingsRes] = await Promise.all([
                await getFollowersLimited(targetUserId, currentUserId),
                await getFollowingLimited(targetUserId, currentUserId),
            ]);

            setFollowers(followersRes);
            setFollowings(followingsRes);
            setLoading(false);
        })();
    }, [currentUserId, targetUserId]);

    return {
        loading,
        followers,
        followings,
    };
}
