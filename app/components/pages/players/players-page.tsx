import PlayersTable from "~/components/pages/players/players-table";
import ListSearch from "~/components/ui/list-search";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import Pagination from "~/components/ui/pagination/pagination";
import { useDeleteEntity } from "~/lib/hooks/use-delete-entity";
import { useListSearchParams } from "~/lib/hooks/use-list-search-params";
import { useSyncPaginationBounds } from "~/lib/hooks/use-sync-pagination-bounds";
import { useDeletePlayerMutation, useGetAllPlayersQuery } from "~/lib/store/animi/players.endpoints";
import type { Player } from "~/lib/types/entities/player-type";

export default function PlayersPage() {
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

    const { data, isLoading, isFetching } = useGetAllPlayersQuery({
        page,
        limit,
        search: search || undefined,
    });
    const [deletePlayer, { isLoading: isDeleting }] =
        useDeletePlayerMutation();

    const players = data?.items ?? [];
    const totalCount = data?.totalCount ?? 0;

    useSyncPaginationBounds({
        page,
        limit,
        totalCount,
        isFetching,
        setPagination,
    });

    const handleDelete = useDeleteEntity<Player, number>({
        deleteMutation: deletePlayer,
        getId: (player) => player.id,
        getConfirmMessage: (player) =>
            `Ви впевнені що хочете видалити плеєр - ${player.title}`,
        successMessage: "Плеєр видалено.",
        errorMessage: "Не вдалося видалити плеєр.",
        itemsOnPage: players.length,
        page,
        onLastPageItemDeleted: () => setPagination(page - 1),
    });

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                title="Плеєри"
                createCllbck="/players/create"
            />

            <ListSearch
                value={searchValue}
                placeholder="Пошук плеєра"
                onChange={setSearchValue}
                onClear={clearSearch}
            />

            <PageCard className="flex flex-col gap-4">
                <PlayersTable
                    players={players}
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
