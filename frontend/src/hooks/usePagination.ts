import { useState, useCallback } from "react";
import { PAGE_SIZE } from "../utils/constants";

interface PaginationState {
    page: number;
    size: number;
    sort: string;
    search: string;
}

export function usePagination(initialSort = "createdAt,desc") {
    const [state, setState] = useState<PaginationState>({
        page: 0,
        size: PAGE_SIZE,
        sort: initialSort,
        search: "",
    });

    const setPage = useCallback((page: number) => setState((s) => ({ ...s, page })), []);

    const setSearch = useCallback(
        (search: string) => setState((s) => ({ ...s, search, page: 0 })),
        [],
    );

    const setSort = useCallback((sort: string) => setState((s) => ({ ...s, sort, page: 0 })), []);

    const reset = useCallback(
        () => setState({ page: 0, size: PAGE_SIZE, sort: initialSort, search: "" }),
        [initialSort],
    );

    return { ...state, setPage, setSearch, setSort, reset };
}
