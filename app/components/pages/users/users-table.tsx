import { Pencil, Trash2 } from "lucide-react";
import Button from "~/components/ui/buttons/button";
import Table, { type TableColumn } from "~/components/ui/table";
import type { User } from "~/lib/types/entities/user-type";
import { beautifyDate } from "~/lib/utils/beautify-date";

interface Props {
    users: User[];
    isLoading?: boolean;
    onDelete: (user: User) => void;
}

export default function UsersTable({ users, isLoading, onDelete }: Props) {
    const columns: TableColumn<User>[] = [
        {
            id: "username",
            header: "Ім'я користувача",
            width: "20%",
            render: (user) => (
                <div className="text-nowrap">{user.username}</div>
            ),
        },
        {
            id: "email",
            header: "Пошта",
            width: "25%",
            render: (user) => <div className="text-nowrap">{user.email}</div>,
        },
        {
            id: "createdAt",
            header: "Створений",
            render: (user) => (
                <div className="text-nowrap">
                    {beautifyDate(user.createdAt)}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Дії",
            width: "1%",
            align: "right",
            render: (user) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        color="RED"
                        isQuad
                        transparent
                        onClick={() => onDelete(user)}
                        tooltipText="Видалити"
                    >
                        <Trash2 size={16} />
                    </Button>
                    <Button
                        color="GREEN"
                        isQuad
                        transparent
                        isLink
                        to={`/users/${user.id}`}
                        tooltipText="Редагувати"
                    >
                        <Pencil size={16} />
                    </Button>
                </div>
            ),
        },
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
