import { INotification } from "@/interfaces/interfaces";
import { getSystemNotifications } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

export default function useSystemNotifications() {
    const [loading, setLoading] = useState<boolean>(true);
    const [notifications, setNotifications] = useState<
        INotification[] | undefined
    >(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getSystemNotifications()
            .then((notifications) => {
                setNotifications(notifications);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    return {
        loading,
        notifications,
        error,
    };
}
