import { IBadge } from "@/interfaces/interfaces";
import { getBadges } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

export default function useBadges() {
    const [loading, setLoading] = useState<boolean>(true);
    const [badges, setBadges] = useState<IBadge[] | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getBadges()
            .then((badges) => {
                setBadges(badges);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return {
        loading,
        badges,
        error,
    };
}
