import clsx from "clsx";
import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type MouseEvent as ReactMouseEvent,
} from "react";
import { Tooltip } from "react-tooltip";

type SelectValuesItem<T> = {
    title: string;
    value: T;
};

interface Props<T> {
    values: SelectValuesItem<T>[];
    className?: string;
    error?: boolean;
    placeholder?: string;
    beforeValue?: string;
    value?: T;
    onChange?: (value: T) => void;
    tooltipText?: string;
}

export default function Select<T>({
    values,
    className,
    error,
    placeholder,
    beforeValue,
    value,
    onChange,
    tooltipText,
}: Props<T>) {
    const tooltipId = useId();
    const rootRef = useRef<HTMLDivElement | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const classes = clsx("relative w-full min-w-0", className);

    const selectedIndex = useMemo(() => {
        return values.findIndex((vl) => vl.value === value);
    }, [values, value]);

    const selected = selectedIndex >= 0 ? values[selectedIndex] : undefined;

    const open = () => {
        setIsOpen(true);
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    };

    const close = () => {
        setIsOpen(false);
    };

    const toggle = () => {
        if (isOpen) {
            close();
            return;
        }

        open();
    };

    const selectValue = (nextValue: T) => {
        onChange?.(nextValue);
        close();
    };

    const handleOptionMouseDown = (
        event: ReactMouseEvent<HTMLButtonElement>,
        nextValue: T,
    ) => {
        event.preventDefault();
        selectValue(nextValue);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (!values.length) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            if (!isOpen) {
                open();
                return;
            }

            setActiveIndex((prev) =>
                prev >= values.length - 1 ? 0 : prev + 1,
            );
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            if (!isOpen) {
                open();
                return;
            }

            setActiveIndex((prev) =>
                prev <= 0 ? values.length - 1 : prev - 1,
            );
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (!isOpen) {
                open();
                return;
            }

            const activeValue = values[activeIndex];

            if (activeValue) {
                selectValue(activeValue.value);
            }
        }

        if (event.key === "Escape") {
            event.preventDefault();
            close();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleDocumentMouseDown = (event: MouseEvent) => {
            if (!rootRef.current) {
                return;
            }

            if (!rootRef.current.contains(event.target as Node)) {
                close();
            }
        };

        document.addEventListener("mousedown", handleDocumentMouseDown);

        return () => {
            document.removeEventListener("mousedown", handleDocumentMouseDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }, [isOpen, selectedIndex]);

    return (
        <div ref={rootRef} className={classes}>
            <button
                className={clsx(
                    "w-full px-3 py-2 bg-(--bg-3) rounded-xl outline-none",
                    "flex items-center justify-between gap-2 text-left",
                    error && "ring-1 ring-(--red)/65",
                )}
                type="button"
                onClick={toggle}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                data-tooltip-id={tooltipId}
                data-tooltip-content={tooltipText}
                data-tooltip-place="right"
            >
                <span className="min-w-0">
                    {selected && (
                        <span className="flex gap-2 min-w-0">
                            {beforeValue && (
                                <span className="text-(--grey-2) shrink-0">
                                    {beforeValue}
                                </span>
                            )}

                            <span className="truncate">{selected.title}</span>
                        </span>
                    )}

                    {!selected && placeholder && (
                        <span className="text-(--grey-2)">{placeholder}</span>
                    )}

                    {!selected && !placeholder && <>&nbsp;</>}
                </span>

                <span
                    className={clsx(
                        "shrink-0 text-(--grey-2) transition-transform",
                        isOpen && "rotate-180",
                    )}
                >
                    ▾
                </span>
            </button>

            {isOpen && (
                <div
                    className="absolute z-20 left-0 top-full w-full bg-(--bg-3) rounded-xl mt-1 flex flex-col gap-1 items-start max-h-40 overflow-y-auto no-scrollbar py-2 px-2 shadow-lg"
                    role="listbox"
                >
                    {values.map((vl, index) => {
                        const isSelected = value === vl.value;
                        const isActive = activeIndex === index;

                        return (
                            <button
                                key={`${String(vl.value)}-${index}`}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseDown={(event) =>
                                    handleOptionMouseDown(event, vl.value)
                                }
                                className={clsx(
                                    "w-full flex items-start text-left py-1 px-2 rounded-md cursor-pointer",
                                    isActive || isSelected
                                        ? "bg-(--bg-4)"
                                        : "hover:bg-(--bg-4)",
                                )}
                            >
                                {vl.title}
                            </button>
                        );
                    })}
                </div>
            )}

            <Tooltip id={tooltipId} />
        </div>
    );
}
