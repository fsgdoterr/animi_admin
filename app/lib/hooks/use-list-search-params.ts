import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getPositiveNumber } from "~/lib/utils/get-positive-number";

interface UseListSearchParamsOptions {
    defaultPage?: number;
    defaultLimit?: number;
    debounceMs?: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_DEBOUNCE_MS = 500;

export function useListSearchParams({
    defaultPage = DEFAULT_PAGE,
    defaultLimit = DEFAULT_LIMIT,
    debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseListSearchParamsOptions = {}) {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = getPositiveNumber(searchParams.get("page"), defaultPage);
    const limit = getPositiveNumber(searchParams.get("limit"), defaultLimit);
    const search = searchParams.get("search") ?? "";
    const [searchValue, setSearchValue] = useState(search);

    const setPagination = useCallback(
        (nextPage: number, nextLimit = limit) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);

                next.set("page", String(nextPage));
                next.set("limit", String(nextLimit));

                return next;
            });
        },
        [limit, setSearchParams],
    );

    useEffect(() => {
        setSearchValue(search);
    }, [search]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            const normalizedSearch = searchValue.trim();

            if (normalizedSearch === search) {
                return;
            }

            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);

                if (normalizedSearch) {
                    next.set("search", normalizedSearch);
                } else {
                    next.delete("search");
                }

                next.set("page", String(defaultPage));
                next.set("limit", String(limit));

                return next;
            });
        }, debounceMs);

        return () => window.clearTimeout(timeoutId);
    }, [debounceMs, defaultPage, limit, search, searchValue, setSearchParams]);

    const clearSearch = useCallback(() => {
        setSearchValue("");
    }, []);

    const onPageChange = useCallback(
        (nextPage: number) => setPagination(nextPage),
        [setPagination],
    );

    const onLimitChange = useCallback(
        (nextLimit: number) => setPagination(defaultPage, nextLimit),
        [defaultPage, setPagination],
    );

    return {
        page,
        limit,
        search,
        searchValue,
        setSearchValue,
        clearSearch,
        setPagination,
        onPageChange,
        onLimitChange,
    };
}
