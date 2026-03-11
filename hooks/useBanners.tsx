import { IBanner } from "@/interfaces/interfaces";
import { getBanners } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

export default function useBanners() {
    const [loading, setLoading] = useState<boolean>(true);
    const [banners, setBanners] = useState<IBanner[] | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getBanners()
            .then((banners) => {
                setBanners(banners);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return {
        loading,
        banners,
        error,
    };
}
