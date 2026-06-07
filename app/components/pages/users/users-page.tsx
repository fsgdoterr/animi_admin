import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search, X } from "lucide-react";
import { useSearchParams } from "react-router";
import UsersTable from "~/components/pages/users/users-table";
import Pagination from "~/components/ui/pagination/pagination";
import Input from "~/components/ui/inputs/input";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import {
    useDeleteUserMutation,
    useGetAllUsersQuery,
} from "~/lib/store/animi/users.endpoint";
import type { User } from "~/lib/types/entities/user-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

function getPositiveNumber(value: string | null, fallback: number) {
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 1) {
        return fallback;
    }

    return Math.floor(parsed);
}

export default function UsersPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = getPositiveNumber(searchParams.get("page"), DEFAULT_PAGE);
    const limit = getPositiveNumber(searchParams.get("limit"), DEFAULT_LIMIT);
    const search = searchParams.get("search") ?? "";
    const [searchValue, setSearchValue] = useState(search);

    const { data, isLoading, isFetching } = useGetAllUsersQuery({
        page,
        limit,
        search: search || undefined,
    });
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const users = data?.items ?? [];
    const totalCount = data?.totalCount ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const setPagination = (nextPage: number, nextLimit = limit) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(nextPage));
            next.set("limit", String(nextLimit));

            return next;
        });
    };

    useEffect(() => {
        setSearchValue(search);
    }, [search]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            const normalizedSearch = searchValue.trim();

            if (normalizedSearch === search) {
                return;
            }

            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);

                if (normalizedSearch) {
                    next.set("search", normalizedSearch);
                } else {
                    next.delete("search");
                }

                next.set("page", String(DEFAULT_PAGE));
                next.set("limit", String(limit));

                return next;
            });
        }, 500);

        return () => window.clearTimeout(timeoutId);
    }, [limit, search, searchValue, setSearchParams]);

    const clearSearch = () => {
        setSearchValue("");
    };

    useEffect(() => {
        if (!isFetching && page > totalPages) {
            setPagination(totalPages);
        }
    }, [isFetching, page, totalPages]);

    const handleDelete = async (user: User) => {
        const answer = confirm(
            "Ви впевнені що хочете видалити користувача - " + user.username,
        );

        if (!answer) {
            return;
        }

        try {
            await deleteUser(user.id).unwrap();
            toast.success("Користувача видалено.");

            if (users.length === 1 && page > 1) {
                setPagination(page - 1);
            }
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, "Не вдалося видалити користувача."),
            );
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader title="Користувачі" createCllbck="/users/create" />

            <div className="flex w-full flex-col gap-2 sm:max-w-md">
                <Input
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Пошук користувача"
                    beforeIcon={<Search size={16} />}
                    className="w-full"
                />

                {searchValue && (
                    <button
                        type="button"
                        className="flex cursor-pointer items-center gap-1 self-start text-sm text-(--grey-2) transition-colors hover:text-white"
                        onClick={clearSearch}
                    >
                        <X size={14} />
                        Очистити пошук
                    </button>
                )}
            </div>

            <PageCard className="flex flex-col gap-4">
                <UsersTable
                    users={users}
                    isLoading={isLoading || isFetching || isDeleting}
                    onDelete={handleDelete}
                />
                <Pagination
                    page={page}
                    limit={limit}
                    totalCount={totalCount}
                    isLoading={isLoading || isFetching}
                    onPageChange={(nextPage) => setPagination(nextPage)}
                    onLimitChange={(nextLimit) => setPagination(1, nextLimit)}
                />
            </PageCard>
        </div>
    );
}
