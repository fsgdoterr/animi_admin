import Table, { type TableColumn } from "~/components/ui/table";
import type { Genre } from "~/lib/types/entities/genre-type";
import {
    createActionsColumn,
    createCreatedAtColumn,
    createIdColumn,
    createTextColumn,
} from "~/lib/utils/table-columns";

interface Props {
    genres: Genre[];
    isLoading?: boolean;
    onDelete: (player: Genre) => void;
}

export default function GenresTable({
    genres,
    isLoading,
    onDelete,
}: Props) {
    const columns: TableColumn<Genre>[] = [
        createIdColumn<Genre>(),
        createTextColumn<Genre>({
            id: "title",
            header: "Назва",
            width: "25%",
            getValue: (genre) => genre.title,
        }),
        createCreatedAtColumn<Genre>(),
        createActionsColumn<Genre>({
            editUrl: (genre) => `/genres/${genre.id}`,
            onDelete,
            width: "110px",
        }),
    ];

    return (
        <Table
            data={genres}
            getRowKey={(row) => row.id}
            columns={columns}
            isLoading={isLoading}
        />
    );
}
