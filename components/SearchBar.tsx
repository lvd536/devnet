import { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";
interface IProps {
    searchValue: string;
    setSearchValue: Dispatch<SetStateAction<string>>;
}

export default function SearchBar({ searchValue, setSearchValue }: IProps) {
    return (
        <div className="flex gap-4 items-center justify-between w-full bg-accent p-4 rounded-3xl">
            <Search className="text-[#ffffff4d] w-5 h-5" />
            <input
                type="text"
                className="outline-0 w-full h-full text-sm"
                placeholder="Поиск людей..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    );
}
