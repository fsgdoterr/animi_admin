import Button from "~/components/ui/buttons/button";

interface Props {
    page: number;
    limit: number;
    totalCount: number;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const limitValues = [10, 20, 50, 100];

export default function Pagination({
    page,
    limit,
    totalCount,
    isLoading,
    onPageChange,
    onLimitChange,
}: Props) {
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const firstItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
    const lastItem = Math.min(page * limit, totalCount);

    return (
        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-(--grey-2) sm:flex-row sm:items-center sm:justify-between">
            <span>
                Показано {firstItem}-{lastItem} з {totalCount}
            </span>

            <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2">
                    <span>На сторінці:</span>
                    <select
                        value={limit}
                        disabled={isLoading}
                        onChange={(event) =>
                            onLimitChange(Number(event.target.value))
                        }
                        className="rounded-md bg-(--bg-3) px-2 py-2 text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {limitValues.map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </label>

                <Button
                    type="button"
                    transparent
                    disabled={page <= 1 || isLoading}
                    onClick={() => onPageChange(page - 1)}
                >
                    Назад
                </Button>

                <span className="rounded-md bg-(--bg-3) px-3 py-2 text-white">
                    {page} / {totalPages}
                </span>

                <Button
                    type="button"
                    transparent
                    disabled={page >= totalPages || isLoading}
                    onClick={() => onPageChange(page + 1)}
                >
                    Вперед
                </Button>
            </div>
        </div>
    );
}
