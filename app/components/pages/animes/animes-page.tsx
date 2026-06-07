import AnimesTable from "~/components/pages/animes/animes-table";
import ListSearch from "~/components/ui/list-search";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import Pagination from "~/components/ui/pagination/pagination";
import { useDeleteEntity } from "~/lib/hooks/use-delete-entity";
import { useListSearchParams } from "~/lib/hooks/use-list-search-params";
import { useSyncPaginationBounds } from "~/lib/hooks/use-sync-pagination-bounds";
import { useDeleteAnimeMutation, useGetAllAnimesQuery } from "~/lib/store/animi/animes.endpoints";
import type { AnimeBase } from "~/lib/types/entities/anime-type";

export default function AnimesPage() {
    const {
        page,
        limit,
        search,
        searchValue,
        setSearchValue,
        clearSearch,
        setPagination,
        onPageChange,
        onLimitChange,
    } = useListSearchParams();

    const { data, isLoading, isFetching } = useGetAllAnimesQuery({
        page,
        limit,
        search: search || undefined,
    });
    const [deleteAnime, { isLoading: isDeleting }] =
        useDeleteAnimeMutation();

    const animes = data?.items ?? [];
    const totalCount = data?.totalCount ?? 0;

    useSyncPaginationBounds({
        page,
        limit,
        totalCount,
        isFetching,
        setPagination,
    });

    const handleDelete = useDeleteEntity<AnimeBase, number>({
        deleteMutation: deleteAnime,
        getId: (anime) => anime.id,
        getConfirmMessage: (anime) =>
            `Ви впевнені що хочете видалити аніме - ${anime.title}`,
        successMessage: "Аніме видалено.",
        errorMessage: "Не вдалося видалити аніме.",
        itemsOnPage: animes.length,
        page,
        onLastPageItemDeleted: () => setPagination(page - 1),
    });

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                title="Аніме"
                createCllbck="/animes/create"
            />

            <ListSearch
                value={searchValue}
                placeholder="Пошук аніме"
                onChange={setSearchValue}
                onClear={clearSearch}
            />

            <PageCard className="flex flex-col gap-4">
                <AnimesTable
                    animes={animes}
                    isLoading={isLoading || isFetching || isDeleting}
                    onDelete={handleDelete}
                />
                <Pagination
                    page={page}
                    limit={limit}
                    totalCount={totalCount}
                    isLoading={isLoading || isFetching}
                    onPageChange={onPageChange}
                    onLimitChange={onLimitChange}
                />
            </PageCard>
        </div>
    );
}
