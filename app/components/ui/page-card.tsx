import clsx from "clsx";
import type { PropsWithChildren } from "react";

interface Props {
    className?: string;
}

export default function PageCard({
    children,
    className,
}: PropsWithChildren<Props>) {
    return (
        <div
            className={clsx(
                "h-full w-full rounded-xl bg-(--bg-2) p-4 sm:p-5",
                className,
            )}
        >
            {children}
        </div>
    );
}
