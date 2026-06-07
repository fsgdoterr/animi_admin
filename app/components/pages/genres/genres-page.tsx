import GenresTable from "~/components/pages/genres/genres-table";
import ListSearch from "~/components/ui/list-search";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import Pagination from "~/components/ui/pagination/pagination";
import { useDeleteEntity } from "~/lib/hooks/use-delete-entity";
import { useListSearchParams } from "~/lib/hooks/use-list-search-params";
import { useSyncPaginationBounds } from "~/lib/hooks/use-sync-pagination-bounds";
import { useDeleteGenreMutation, useGetAllGenresQuery } from "~/lib/store/animi/genres.endpoints";
import type { Genre } from "~/lib/types/entities/genre-type";

export default function GenresPage() {
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

    const { data, isLoading, isFetching } = useGetAllGenresQuery({
        page,
        limit,
        search: search || undefined,
    });
    const [deleteGenre, { isLoading: isDeleting }] =
        useDeleteGenreMutation();

    const genres = data?.items ?? [];
    const totalCount = data?.totalCount ?? 0;

    useSyncPaginationBounds({
        page,
        limit,
        totalCount,
        isFetching,
        setPagination,
    });

    const handleDelete = useDeleteEntity<Genre, number>({
        deleteMutation: deleteGenre,
        getId: (genre) => genre.id,
        getConfirmMessage: (genre) =>
            `Ви впевнені що хочете видалити жанр - ${genre.title}`,
        successMessage: "Жанр видалено.",
        errorMessage: "Не вдалося видалити жанр.",
        itemsOnPage: genres.length,
        page,
        onLastPageItemDeleted: () => setPagination(page - 1),
    });

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                title="Жанри"
                createCllbck="/genres/create"
            />

            <ListSearch
                value={searchValue}
                placeholder="Пошук жанру"
                onChange={setSearchValue}
                onClear={clearSearch}
            />

            <PageCard className="flex flex-col gap-4">
                <GenresTable
                    genres={genres}
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
