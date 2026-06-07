import ActionBttns from "~/components/action-bttns";
import type { TableColumn } from "~/components/ui/table";
import { beautifyDate } from "~/lib/utils/beautify-date";

interface EntityWithId {
    id: number | string;
}

interface EntityWithCreatedAt {
    createdAt: string;
}

interface TextColumnOptions<T> {
    id: string;
    header: string;
    width?: string;
    getValue: (row: T) => string | number | null | undefined;
}

interface ActionsColumnOptions<T extends EntityWithId> {
    editUrl: (row: T) => string;
    onDelete: (row: T) => void;
    width?: string;
}

export function createIdColumn<T extends EntityWithId>(): TableColumn<T> {
    return {
        id: "id",
        header: "ID",
        width: "75px",
        render: (row) => <div className="text-nowrap">{row.id}</div>,
    };
}

export function createTextColumn<T>({
    id,
    header,
    width,
    getValue,
}: TextColumnOptions<T>): TableColumn<T> {
    return {
        id,
        header,
        width,
        render: (row) => <div className="text-nowrap">{getValue(row)}</div>,
    };
}

export function createCreatedAtColumn<T extends EntityWithCreatedAt>(): TableColumn<T> {
    return {
        id: "createdAt",
        header: "Створений",
        render: (row) => (
            <div className="text-nowrap">{beautifyDate(row.createdAt)}</div>
        ),
    };
}

export function createActionsColumn<T extends EntityWithId>({
    editUrl,
    onDelete,
    width = "100px",
}: ActionsColumnOptions<T>): TableColumn<T> {
    return {
        id: "actions",
        header: "Дії",
        width,
        align: "right",
        render: (row) => (
            <ActionBttns onDelete={() => onDelete(row)} edit={editUrl(row)} />
        ),
    };
}
