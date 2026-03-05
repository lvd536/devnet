import useSearch from "@/hooks/useSearch";
import SearchBar from "../../SearchBar";
import { AdminUsersTable } from "./AdminUsersTable";

export default function AdminUsersTab() {
    const { searchValue, users, loading, error, setSearchValue } = useSearch();
    return (
        <div className="flex flex-col w-full gap-4 mt-2">
            <SearchBar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            <AdminUsersTable users={users} loading={loading} error={error} />
        </div>
    );
}
