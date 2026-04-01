import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect } from "react";

interface Props {
    placeholder?: string;
    onSearch: (value: string) => void;
}

export function SearchInput({ placeholder = "Tìm kiếm...", onSearch }: Props) {
    const [value, setValue] = useState("");
    const debounced = useDebounce(value, 400);

    useEffect(() => {
        onSearch(debounced);
    }, [debounced, onSearch]);

    return (
        <div className="relative bg-[#e0e3e5] rounded-xl">
            <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                data-icon="search"
            >
                search
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="input-field pl-9 border-none py-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            />
        </div>
    );
}
