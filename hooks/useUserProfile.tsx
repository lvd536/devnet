import { IUserProfile } from "@/interfaces/interfaces";
import { getUserData } from "@/utils/firebaseFunctions";
import { useEffect, useState } from "react";

export default function useUserProfile(userId: string) {
    const [userProfile, setUserProfile] = useState<IUserProfile | undefined>(
        undefined,
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!userId) {
            setTimeout(() => setLoading(false));
            return;
        }
        getUserData(userId)
            .then((data) => {
                setUserProfile(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [userId]);

    return { userProfile, loading, error };
}
