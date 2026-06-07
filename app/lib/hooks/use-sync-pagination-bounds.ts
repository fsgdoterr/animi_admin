import { useEffect, useMemo } from "react";

interface UseSyncPaginationBoundsOptions {
    page: number;
    limit: number;
    totalCount: number;
    isFetching?: boolean;
    setPagination: (nextPage: number, nextLimit?: number) => void;
}

export function useSyncPaginationBounds({
    page,
    limit,
    totalCount,
    isFetching = false,
    setPagination,
}: UseSyncPaginationBoundsOptions) {
    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(totalCount / limit)),
        [limit, totalCount],
    );

    useEffect(() => {
        if (!isFetching && page > totalPages) {
            setPagination(totalPages);
        }
    }, [isFetching, page, setPagination, totalPages]);

    return totalPages;
}
