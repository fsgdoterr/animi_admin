import Table, { type TableColumn } from "~/components/ui/table";
import type { ReleaseTeam } from "~/lib/types/entities/release-team-type";
import {
    createActionsColumn,
    createCreatedAtColumn,
    createIdColumn,
    createTextColumn,
} from "~/lib/utils/table-columns";

interface Props {
    releaseTeams: ReleaseTeam[];
    isLoading?: boolean;
    onDelete: (releaseTeam: ReleaseTeam) => void;
}

export default function ReleaseteamsTable({
    releaseTeams,
    isLoading,
    onDelete,
}: Props) {
    const columns: TableColumn<ReleaseTeam>[] = [
        createIdColumn<ReleaseTeam>(),
        createTextColumn<ReleaseTeam>({
            id: "title",
            header: "Назва",
            width: "25%",
            getValue: (releaseTeam) => releaseTeam.title,
        }),
        createCreatedAtColumn<ReleaseTeam>(),
        createActionsColumn<ReleaseTeam>({
            editUrl: (releaseTeam) => `/releaseteams/${releaseTeam.id}`,
            onDelete,
            width: "110px",
        }),
    ];

    return (
        <Table
            data={releaseTeams}
            getRowKey={(row) => row.id}
            columns={columns}
            isLoading={isLoading}
        />
    );
}
