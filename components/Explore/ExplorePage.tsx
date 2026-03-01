"use client";
import useSearch from "@/hooks/useSearch";
import ExploreSearchBar from "./ExploreSearchBar";
import ExploreUsers from "./ExploreUsers";

export default function ExplorePage() {
    const { searchValue, users, loading, error, setSearchValue } = useSearch();
    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-xl">Поиск</h1>
            <ExploreSearchBar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            <ExploreUsers users={users} loading={loading} error={error} />
        </div>
    );
}
