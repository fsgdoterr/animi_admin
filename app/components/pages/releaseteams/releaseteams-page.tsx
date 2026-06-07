import ReleaseteamsTable from "~/components/pages/releaseteams/releaseteams-table";
import ListSearch from "~/components/ui/list-search";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import Pagination from "~/components/ui/pagination/pagination";
import { useDeleteEntity } from "~/lib/hooks/use-delete-entity";
import { useListSearchParams } from "~/lib/hooks/use-list-search-params";
import { useSyncPaginationBounds } from "~/lib/hooks/use-sync-pagination-bounds";
import {
    useDeleteReleaseTeamMutation,
    useGetAllReleaseTeamsQuery,
} from "~/lib/store/animi/releaseteams.endpoints";
import type { ReleaseTeam } from "~/lib/types/entities/release-team-type";

export default function ReleaseteamsPage() {
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

    const { data, isLoading, isFetching } = useGetAllReleaseTeamsQuery({
        page,
        limit,
        search: search || undefined,
    });
    const [deleteReleaseTeam, { isLoading: isDeleting }] =
        useDeleteReleaseTeamMutation();

    const releaseTeams = data?.items ?? [];
    const totalCount = data?.totalCount ?? 0;

    useSyncPaginationBounds({
        page,
        limit,
        totalCount,
        isFetching,
        setPagination,
    });

    const handleDelete = useDeleteEntity<ReleaseTeam, number>({
        deleteMutation: deleteReleaseTeam,
        getId: (releaseTeam) => releaseTeam.id,
        getConfirmMessage: (releaseTeam) =>
            `Ви впевнені що хочете видалити команду озвучення - ${releaseTeam.title}`,
        successMessage: "Команду озвучення видалено.",
        errorMessage: "Не вдалося видалити команду озвучення.",
        itemsOnPage: releaseTeams.length,
        page,
        onLastPageItemDeleted: () => setPagination(page - 1),
    });

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                title="Команди озвучення"
                createCllbck="/releaseteams/create"
            />

            <ListSearch
                value={searchValue}
                placeholder="Пошук команди"
                onChange={setSearchValue}
                onClear={clearSearch}
            />

            <PageCard className="flex flex-col gap-4">
                <ReleaseteamsTable
                    releaseTeams={releaseTeams}
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
