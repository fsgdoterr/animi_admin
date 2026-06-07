import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import Button from "~/components/ui/buttons/button";

interface Props {
    backUrl?: string;
    title: string;
    createCllbck?: string | (() => void);
    className?: string;
    buttons?: ReactNode;
}

export default function PageHeader({
    backUrl,
    title,
    createCllbck,
    className,
    buttons,
}: Props) {
    return (
        <div
            className={clsx(
                "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                className,
            )}
        >
            <div className="flex min-w-0 items-center gap-2">
                {backUrl && (
                    <Button
                        isLink
                        to={backUrl}
                        isQuad
                        transparent
                        color="TRANSPARENT"
                        className="shrink-0"
                    >
                        <ArrowLeft size={16} />
                    </Button>
                )}
                <h1 className="min-w-0 truncate text-2xl sm:text-3xl">
                    {title}
                </h1>
            </div>

            {(buttons || createCllbck) && (
                <div className="w-full sm:w-auto">
                    {buttons ? (
                        buttons
                    ) : typeof createCllbck === "string" ? (
                        <Button
                            color="GREEN"
                            isLink
                            to={createCllbck}
                            className="w-full sm:w-auto"
                        >
                            Створити
                        </Button>
                    ) : (
                        <Button
                            color="GREEN"
                            onClick={createCllbck}
                            className="w-full sm:w-auto"
                        >
                            Створити
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
