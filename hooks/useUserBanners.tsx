import { IUserBanner } from "@/interfaces/interfaces";
import { getUserBanners } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

interface IProps {
    userId: string;
}

export default function useUserBanners({ userId }: IProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [userBanners, setUserBanners] = useState<IUserBanner[] | undefined>(
        undefined,
    );
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getUserBanners(userId)
            .then((banners) => {
                setUserBanners(banners);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId]);

    return {
        loading,
        userBanners,
        error,
    };
}
