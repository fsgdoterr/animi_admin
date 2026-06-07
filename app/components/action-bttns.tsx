import { Pencil, Trash2 } from "lucide-react";
import Button from "~/components/ui/buttons/button";

interface Props {
    onDelete: () => void;
    edit: string;
}

export default function ActionBttns({ onDelete, edit }: Props) {
    return (
        <div className="flex items-center justify-end gap-2">
            <Button
                color="RED"
                isQuad
                transparent
                onClick={onDelete}
                tooltipText="Видалити"
            >
                <Trash2 size={16} />
            </Button>
            <Button
                color="GREEN"
                isQuad
                transparent
                isLink
                to={edit}
                tooltipText="Редагувати"
            >
                <Pencil size={16} />
            </Button>
        </div>
    );
}
