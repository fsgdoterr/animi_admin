import Table, { type TableColumn } from "~/components/ui/table";
import type { User } from "~/lib/types/entities/user-type";
import {
    createActionsColumn,
    createCreatedAtColumn,
    createIdColumn,
    createTextColumn,
} from "~/lib/utils/table-columns";

interface Props {
    users: User[];
    isLoading?: boolean;
    onDelete: (user: User) => void;
}

export default function UsersTable({ users, isLoading, onDelete }: Props) {
    const columns: TableColumn<User>[] = [
        createIdColumn<User>(),
        createTextColumn<User>({
            id: "username",
            header: "Ім'я користувача",
            width: "20%",
            getValue: (user) => user.username,
        }),
        createTextColumn<User>({
            id: "email",
            header: "Пошта",
            width: "25%",
            getValue: (user) => user.email,
        }),
        createCreatedAtColumn<User>(),
        createActionsColumn<User>({
            editUrl: (user) => `/users/${user.id}`,
            onDelete,
        }),
    ];

    return (
        <Table
            data={users}
            getRowKey={(row) => row.id}
            columns={columns}
            isLoading={isLoading}
        />
    );
}
