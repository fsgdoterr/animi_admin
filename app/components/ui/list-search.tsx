import { Search, X } from "lucide-react";
import Input from "~/components/ui/inputs/input";

interface Props {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    onClear: () => void;
    clearText?: string;
}

export default function ListSearch({
    value,
    placeholder,
    onChange,
    onClear,
    clearText = "Очистити пошук",
}: Props) {
    return (
        <div className="flex w-full flex-col gap-2 sm:max-w-md">
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                beforeIcon={<Search size={16} />}
                className="w-full"
            />

            {value && (
                <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1 self-start text-sm text-(--grey-2) transition-colors hover:text-white"
                    onClick={onClear}
                >
                    <X size={14} />
                    {clearText}
                </button>
            )}
        </div>
    );
}
