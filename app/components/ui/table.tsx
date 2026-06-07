import type { ReactNode } from "react";

type Align = "left" | "center" | "right";

export type TableColumn<T> = {
    id: string;
    header: ReactNode;
    width?: string;
    align?: Align;
    className?: string;
    headerClassName?: string;
    render: (row: T, index: number) => ReactNode;
};

type TableProps<T> = {
    data: T[];
    columns: TableColumn<T>[];
    getRowKey: (row: T, index: number) => string | number;

    isLoading?: boolean;
    emptyText?: string;

    className?: string;
    rowClassName?: string | ((row: T, index: number) => string);
};

function alignClass(align?: Align) {
    switch (align) {
        case "center":
            return "text-center";
        case "right":
            return "text-right";
        default:
            return "text-left";
    }
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function Table<T>({
    data,
    columns,
    getRowKey,
    isLoading = false,
    emptyText = "Немає даних",
    className,
    rowClassName,
}: TableProps<T>) {
    return (
        <div className={cn("w-full overflow-x-auto", className)}>
            <table className="min-w-[680px] w-full border-collapse text-sm text-neutral-200 sm:text-md">
                <thead>
                    <tr className="h-10 bg-neutral-500 text-neutral-100">
                        {columns.map((column, index) => (
                            <th
                                key={column.id}
                                style={{ width: column.width }}
                                className={cn(
                                    "px-3 py-2 font-normal first:rounded-l last:rounded-r",
                                    alignClass(column.align),
                                    index === 0 && "pl-4",
                                    column.headerClassName,
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {isLoading && (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-8 text-center text-neutral-400"
                            >
                                Завантаження...
                            </td>
                        </tr>
                    )}

                    {!isLoading && data.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-8 text-center text-neutral-400"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    )}

                    {!isLoading &&
                        data.map((row, rowIndex) => {
                            const customRowClass =
                                typeof rowClassName === "function"
                                    ? rowClassName(row, rowIndex)
                                    : rowClassName;

                            return (
                                <tr
                                    key={getRowKey(row, rowIndex)}
                                    className={cn(
                                        "border-b border-neutral-700/80 transition-colors hover:bg-white/[0.03]",
                                        customRowClass,
                                    )}
                                >
                                    {columns.map((column, columnIndex) => (
                                        <td
                                            key={column.id}
                                            className={cn(
                                                "px-3 py-2 align-middle",
                                                alignClass(column.align),
                                                columnIndex === 0 && "pl-4",
                                                column.className,
                                            )}
                                        >
                                            {column.render(row, rowIndex)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
