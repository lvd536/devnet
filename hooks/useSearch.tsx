import { IUserProfile } from "@/interfaces/interfaces";
import { searchUsers } from "@/utils/firebaseFunctions";
import { useState, useEffect } from "react";

export default function useSearch() {
    const [searchValue, setSearchValue] = useState<string>("");
    const [users, setUsers] = useState<IUserProfile[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = setTimeout(() => {
            setLoading(true);
            setError(null);
            if (!searchValue) {
                setLoading(false);
                setError("Пусто");
                return;
            }
            if (searchValue && searchValue.length < 2) {
                setLoading(false);
                setError("Минимальное кол-во символов для поиска - 2");
                return;
            }
            searchUsers(searchValue).then((usersResp) => {
                if (!usersResp) {
                    setError("Пусто");
                    setUsers(undefined);
                    setLoading(false);
                    return;
                } else {
                    setUsers(usersResp);
                    setLoading(false);
                }
            });
        }, 300);
        return () => clearTimeout(unsubscribe);
    }, [searchValue]);

    return { searchValue, users, loading, error, setSearchValue };
}
