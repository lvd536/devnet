import { IUserBadge } from "@/interfaces/interfaces";
import { getUserBadges } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

interface IProps {
    userId: string;
}

export default function useUserBadges({ userId }: IProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [userBadges, setUserBadges] = useState<IUserBadge[] | undefined>(
        undefined,
    );
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getUserBadges(userId)
            .then((badges) => {
                setUserBadges(badges);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId]);

    return {
        loading,
        userBadges,
        error,
    };
}
