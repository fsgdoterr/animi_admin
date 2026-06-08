import clsx from "clsx";
import { LockKeyhole } from "lucide-react";
import type { MouseEvent } from "react";

interface Props {
    text: string;
    isActive?: boolean;
    className?: string;
    disabled?: boolean;
    onClicked?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function TabButton({
    className,
    isActive,
    text,
    disabled,
    onClicked,
}: Props) {
    const classes = clsx(
        "py-1 px-2.5 rounded-md text-sm flex gap-2 items-center",
        isActive && !disabled && "bg-(--primary)",
        disabled && "bg-(--grey-2)",
        !disabled && "cursor-pointer",
        className,
    );

    const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        if (!isActive && !disabled) onClicked?.(e);
    };

    return (
        <button className={classes} onClick={clickHandler}>
            {disabled && <LockKeyhole size={16} />}
            {text}
        </button>
    );
}
