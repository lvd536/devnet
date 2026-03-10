import useSearch from "@/hooks/useSearch";
import SearchBar from "../../SearchBar";
import { AdminUsersTable } from "./AdminUsersTable";
import { auth } from "@/lib/firebase";
import { AdminUsersSkeleton } from "@/components/Skeletons/Admin/AdminUsersSkeleton";

export default function AdminUsersTab() {
    const { searchValue, users, loading, error, setSearchValue } = useSearch();
    const userId = auth.currentUser?.uid;

    if (!userId) return null;

    if (loading) return <AdminUsersSkeleton />;

    return (
        <div className="flex flex-col w-full gap-4 mt-2">
            <SearchBar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            <AdminUsersTable users={users} error={error} userId={userId} />
        </div>
    );
}
