import Table, { type TableColumn } from "~/components/ui/table";
import type { Player } from "~/lib/types/entities/player-type";
import {
    createActionsColumn,
    createCreatedAtColumn,
    createIdColumn,
    createTextColumn,
} from "~/lib/utils/table-columns";

interface Props {
    players: Player[];
    isLoading?: boolean;
    onDelete: (player: Player) => void;
}

export default function PlayersTable({
    players,
    isLoading,
    onDelete,
}: Props) {
    const columns: TableColumn<Player>[] = [
        createIdColumn<Player>(),
        createTextColumn<Player>({
            id: "title",
            header: "Назва",
            width: "25%",
            getValue: (player) => player.title,
        }),
        createCreatedAtColumn<Player>(),
        createActionsColumn<Player>({
            editUrl: (player) => `/players/${player.id}`,
            onDelete,
            width: "110px",
        }),
    ];

    return (
        <Table
            data={players}
            getRowKey={(row) => row.id}
            columns={columns}
            isLoading={isLoading}
        />
    );
}
