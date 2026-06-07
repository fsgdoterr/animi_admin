import ActionBttns from "~/components/action-bttns";
import type { TableColumn } from "~/components/ui/table";
import { API_URL } from "~/lib/constants/api";
import type { Image } from "~/lib/types/entities/image-type";
import { beautifyDate } from "~/lib/utils/beautify-date";

interface EntityWithId {
    id: number | string;
}

interface EntityWithTitleAndPoster {
    title: string;
    poster?: Image | null;
}

interface EntityWithCreatedAt {
    createdAt: string;
}

interface EntityWithUpdatedAt {
    updatedAt: string;
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
        width: "40px",
        render: (row) => <div className="text-nowrap">{row.id}</div>,
    };
}

export function createTitleWithPosterColumn<
    T extends EntityWithTitleAndPoster,
>(): TableColumn<T> {
    return {
        id: "titleAndPoster",
        header: "Назва",
        width: "330px",
        render: (row) => (
            <div className="flex gap-2.5 items-center">
                {!!row.poster ? (
                    <img
                        src={`${API_URL}/uploads/${row.poster.path}`}
                        alt={row.title}
                        className="w-13 h-13 object-cover rounded-lg"
                    />
                ) : (
                    <div className="w-13 h-13 rounded-lg bg-(--grey-2)" />
                )}
                <div className="flex-1 line-clamp-2">
                    {row.title}
                </div>
            </div>
        ),
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

export function createCreatedAtColumn<
    T extends EntityWithCreatedAt,
>(width?: string): TableColumn<T> {
    return {
        id: "createdAt",
        header: "Створений",
        width,
        render: (row) => (
            <div className="text-nowrap">{beautifyDate(row.createdAt)}</div>
        ),
    };
}
export function createUpdatedAtColumn<
    T extends EntityWithUpdatedAt,
>(width?: string): TableColumn<T> {
    return {
        id: "updatedAt",
        header: "Зміни",
        width,
        render: (row) => (
            <div className="text-nowrap">{beautifyDate(row.updatedAt)}</div>
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
