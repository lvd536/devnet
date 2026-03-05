import { IRole } from "@/interfaces/interfaces";
import { getRoles } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

export default function useRoles() {
    const [loading, setLoading] = useState<boolean>(true);
    const [roles, setRoles] = useState<IRole[] | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getRoles()
            .then((roles) => {
                setRoles(roles);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return {
        loading,
        roles,
        error,
    };
}
