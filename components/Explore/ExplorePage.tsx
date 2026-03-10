"use client";
import useSearch from "@/hooks/useSearch";
import SearchBar from "../SearchBar";
import ExploreUsers from "./ExploreUsers";
import { ExploreSkeleton } from "../Skeletons/Explore/ExploreSkeleton";

export default function ExplorePage() {
    const { searchValue, users, loading, error, setSearchValue } = useSearch();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-xl">Поиск</h1>
            <SearchBar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            {loading ? (
                <ExploreSkeleton />
            ) : (
                <ExploreUsers users={users} error={error} />
            )}
        </div>
    );
}
