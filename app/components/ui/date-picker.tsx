import clsx from "clsx";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
    forwardRef,
    type InputHTMLAttributes,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";

type DateTimeValue = string; // ISO-8601 DateTime: 2026-06-01T00:00:00.000Z
type DateKey = string; // Internal calendar value: YYYY-MM-DD

export interface DateRangeValue {
    from?: DateTimeValue | null;
    to?: DateTimeValue | null;
}

interface Props
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "value" | "defaultValue" | "onChange" | "children" | "type"
    > {
    className?: string;
    triggerClassName?: string;
    dropdownClassName?: string;

    beforePlaceholder?: string;
    placeholder?: string;

    value?: DateRangeValue;
    defaultValue?: DateRangeValue;
    onChange?: (value: DateRangeValue) => void;

    minDate?: DateTimeValue;
    maxDate?: DateTimeValue;

    minYear?: number;
    maxYear?: number;
    error?: boolean;
}

const MONTHS = [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
];

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

function pad(value: number) {
    return String(value).padStart(2, "0");
}

function dateToDateKey(date: Date): DateKey {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
    )}`;
}

function dateKeyToLocalDate(value?: DateKey | null) {
    if (!value) return null;

    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) return null;

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

function isValidDateKey(value?: string | null): value is DateKey {
    if (!value) return false;

    const date = dateKeyToLocalDate(value);

    return !!date;
}

function dateTimeToDateKey(value?: DateTimeValue | null) {
    if (!value) return null;

    const dateKey = value.slice(0, 10);

    if (!isValidDateKey(dateKey)) return null;

    return dateKey;
}

function dateTimeToLocalDate(value?: DateTimeValue | null) {
    const dateKey = dateTimeToDateKey(value);

    return dateKeyToLocalDate(dateKey);
}

function dateKeyToStartOfDayIso(dateKey: DateKey): DateTimeValue {
    return `${dateKey}T00:00:00.000Z`;
}

function dateKeyToEndOfDayIso(dateKey: DateKey): DateTimeValue {
    return `${dateKey}T23:59:59.999Z`;
}

function formatDate(value?: DateTimeValue | null) {
    const dateKey = dateTimeToDateKey(value);

    if (!dateKey) return "";

    const [year, month, day] = dateKey.split("-");

    return `${day}.${month}.${year}`;
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isBefore(a: DateKey, b: DateKey) {
    return a < b;
}

function isAfter(a: DateKey, b: DateKey) {
    return a > b;
}

function isInRange(
    date: DateKey,
    from?: DateTimeValue | null,
    to?: DateTimeValue | null,
) {
    const fromKey = dateTimeToDateKey(from);
    const toKey = dateTimeToDateKey(to);

    if (!fromKey || !toKey) return false;

    return date > fromKey && date < toKey;
}

function getCalendarDays(monthDate: Date) {
    const firstDayOfMonth = startOfMonth(monthDate);

    const mondayOffset = (firstDayOfMonth.getDay() + 6) % 7;

    const startDate = new Date(
        firstDayOfMonth.getFullYear(),
        firstDayOfMonth.getMonth(),
        1 - mondayOffset,
    );

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + index,
        );

        return {
            date,
            value: dateToDateKey(date),
            isCurrentMonth: date.getMonth() === monthDate.getMonth(),
        };
    });
}

function getYearFromDate(value?: DateTimeValue | null) {
    return dateTimeToLocalDate(value)?.getFullYear();
}

interface CalendarPanelProps {
    title: string;
    description: string;

    monthDate: Date;
    onMonthDateChange: (date: Date) => void;

    range: DateRangeValue;
    selectedDate?: DateTimeValue | null;

    minDate?: DateTimeValue;
    maxDate?: DateTimeValue;

    minYear: number;
    maxYear: number;

    onSelect: (value: DateKey) => void;
}

function CalendarPanel({
    title,
    description,
    monthDate,
    onMonthDateChange,
    range,
    selectedDate,
    minDate,
    maxDate,
    minYear,
    maxYear,
    onSelect,
}: CalendarPanelProps) {
    const days = useMemo(() => getCalendarDays(monthDate), [monthDate]);

    const years = useMemo(() => {
        return Array.from(
            { length: maxYear - minYear + 1 },
            (_, index) => minYear + index,
        );
    }, [minYear, maxYear]);

    const selectedDateKey = dateTimeToDateKey(selectedDate);
    const minDateKey = dateTimeToDateKey(minDate);
    const maxDateKey = dateTimeToDateKey(maxDate);

    const setMonth = (month: number) => {
        onMonthDateChange(new Date(monthDate.getFullYear(), month, 1));
    };

    const setYear = (year: number) => {
        onMonthDateChange(new Date(year, monthDate.getMonth(), 1));
    };

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-2">
            <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-(--grey-2)">{description}</p>
            </div>

            <div className="rounded-xl bg-(--bg-3) p-1.5">
                <div className="mb-1.5 flex items-center gap-1">
                    <button
                        type="button"
                        className="rounded-lg p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        onClick={() => onMonthDateChange(addMonths(monthDate, -1))}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <select
                        className="min-w-0 flex-1 rounded-lg bg-(--bg-4) px-1.5 py-1 text-xs outline-none"
                        value={monthDate.getMonth()}
                        onChange={(event) => setMonth(Number(event.target.value))}
                    >
                        {MONTHS.map((month, index) => (
                            <option key={month} value={index}>
                                {month}
                            </option>
                        ))}
                    </select>

                    <select
                        className="w-20 rounded-lg bg-(--bg-4) px-1.5 py-1 text-xs outline-none"
                        value={monthDate.getFullYear()}
                        onChange={(event) => setYear(Number(event.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="rounded-lg p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        onClick={() => onMonthDateChange(addMonths(monthDate, 1))}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-0.5">
                    {WEEK_DAYS.map((day) => (
                        <div
                            key={day}
                            className="py-0.5 text-center text-[11px] text-(--grey-2)"
                        >
                            {day}
                        </div>
                    ))}

                    {days.map((day) => {
                        const disabled =
                            (minDateKey && isBefore(day.value, minDateKey)) ||
                            (maxDateKey && isAfter(day.value, maxDateKey));

                        const selected = selectedDateKey === day.value;
                        const inRange = isInRange(day.value, range.from, range.to);

                        return (
                            <button
                                key={day.value}
                                type="button"
                                disabled={!!disabled}
                                className={clsx(
                                    "aspect-square rounded-md text-xs transition-colors",
                                    !day.isCurrentMonth && "text-white/25",
                                    day.isCurrentMonth && "text-white/80",
                                    !disabled && "hover:bg-white/10 hover:text-white",
                                    disabled && "cursor-not-allowed opacity-30",
                                    inRange && "bg-white/5",
                                    selected &&
                                        "!bg-(--primary) !text-white hover:!bg-(--primary)",
                                )}
                                onClick={() => onSelect(day.value)}
                            >
                                {day.date.getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const DatePicker = forwardRef<HTMLInputElement, Props>(
    (
        {
            id,
            name,
            disabled,
            className,
            triggerClassName,
            dropdownClassName,
            beforePlaceholder,
            placeholder = "Оберіть дату",

            value,
            defaultValue = { from: null, to: null },
            onChange,

            minDate,
            maxDate,
            minYear,
            maxYear,
            error,

            ...inputProps
        },
        ref,
    ) => {
        const generatedId = useId();
        const inputId = id ?? `date-picker-${generatedId}`;

        const rootRef = useRef<HTMLDivElement>(null);

        const isControlled = value !== undefined;

        const [open, setOpen] = useState(false);
        const [innerValue, setInnerValue] = useState<DateRangeValue>(defaultValue);

        const today = useMemo(() => new Date(), []);

        const selectedValue = isControlled ? value : innerValue;

        const currentYear = today.getFullYear();

        const yearMin = minYear ?? getYearFromDate(minDate) ?? currentYear - 100;
        const yearMax = maxYear ?? getYearFromDate(maxDate) ?? currentYear + 10;

        const [fromMonth, setFromMonth] = useState(() => {
            return startOfMonth(
                dateTimeToLocalDate(value?.from ?? defaultValue.from) ?? today,
            );
        });

        const [toMonth, setToMonth] = useState(() => {
            const baseDate =
                dateTimeToLocalDate(value?.to ?? defaultValue.to) ??
                addMonths(
                    dateTimeToLocalDate(value?.from ?? defaultValue.from) ?? today,
                    1,
                );

            return startOfMonth(baseDate);
        });

        const selectedText = useMemo(() => {
            const from = selectedValue?.from;
            const to = selectedValue?.to;

            if (from && to) {
                return `${formatDate(from)} — ${formatDate(to)}`;
            }

            if (from) {
                return `Від ${formatDate(from)}`;
            }

            if (to) {
                return `До ${formatDate(to)}`;
            }

            return null;
        }, [selectedValue]);

        const updateValue = (nextValue: DateRangeValue) => {
            if (!isControlled) {
                setInnerValue(nextValue);
            }

            onChange?.(nextValue);
        };

        const selectFromDate = (dateKey: DateKey) => {
            const currentFrom = selectedValue?.from ?? null;
            const currentTo = selectedValue?.to ?? null;

            const currentFromKey = dateTimeToDateKey(currentFrom);
            const currentToKey = dateTimeToDateKey(currentTo);

            if (currentFromKey === dateKey) {
                updateValue({
                    from: null,
                    to: currentTo,
                });

                return;
            }

            updateValue({
                from: dateKeyToStartOfDayIso(dateKey),
                to: currentToKey && isAfter(dateKey, currentToKey) ? null : currentTo,
            });
        };

        const selectToDate = (dateKey: DateKey) => {
            const currentFrom = selectedValue?.from ?? null;
            const currentTo = selectedValue?.to ?? null;

            const currentFromKey = dateTimeToDateKey(currentFrom);
            const currentToKey = dateTimeToDateKey(currentTo);

            if (currentToKey === dateKey) {
                updateValue({
                    from: currentFrom,
                    to: null,
                });

                return;
            }

            updateValue({
                from:
                    currentFromKey && isAfter(currentFromKey, dateKey)
                        ? null
                        : currentFrom,
                to: dateKeyToEndOfDayIso(dateKey),
            });
        };

        const clearValue = () => {
            updateValue({ from: null, to: null });
        };

        useEffect(() => {
            const fromDate = dateTimeToLocalDate(value?.from);

            if (!fromDate) return;

            setFromMonth(startOfMonth(fromDate));
        }, [value?.from]);

        useEffect(() => {
            const toDate = dateTimeToLocalDate(value?.to);

            if (!toDate) return;

            setToMonth(startOfMonth(toDate));
        }, [value?.to]);

        useEffect(() => {
            if (!open) return;

            const handlePointerDown = (event: PointerEvent) => {
                if (!rootRef.current?.contains(event.target as Node)) {
                    setOpen(false);
                }
            };

            document.addEventListener("pointerdown", handlePointerDown);

            return () => {
                document.removeEventListener("pointerdown", handlePointerDown);
            };
        }, [open]);

        return (
            <div
                ref={rootRef}
                className={clsx(
                    "relative w-full",
                    disabled && "pointer-events-none opacity-60",
                    className,
                )}
            >
                <input
                    {...inputProps}
                    ref={ref}
                    id={inputId}
                    type="hidden"
                    name={name}
                    disabled={disabled}
                    readOnly
                    value={JSON.stringify({
                        from: selectedValue?.from ?? null,
                        to: selectedValue?.to ?? null,
                    })}
                />

                <button
                    type="button"
                    disabled={disabled}
                    className={clsx(
                        "flex w-full cursor-pointer items-center justify-between gap-3 bg-(--bg-3) px-3 py-2 text-left text-md outline-none transition-colors",
                        "focus-visible:ring-2 focus-visible:ring-(--primary)",
                        open ? "rounded-t-xl" : "rounded-xl",
                        error && "border border-(--red)",
                        triggerClassName,
                    )}
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <span className="min-w-0 flex-1 truncate">
                        {beforePlaceholder && (
                            <span className="mr-1 text-(--grey-2)">
                                {beforePlaceholder}
                            </span>
                        )}

                        <span
                            className={clsx(
                                "truncate",
                                !selectedText && "text-(--grey-2)",
                            )}
                        >
                            {selectedText ?? placeholder}
                        </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-1">
                        {(selectedValue?.from || selectedValue?.to) && (
                            <span
                                role="button"
                                tabIndex={0}
                                className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    clearValue();
                                }}
                            >
                                <X size={16} />
                            </span>
                        )}

                        <ChevronDown
                            size={20}
                            className={clsx(
                                "transition-transform duration-200",
                                open && "rotate-180",
                            )}
                        />
                    </span>
                </button>

                {open && (
                    <div
                        className={clsx(
                            "absolute left-0 top-full z-50 grid w-[34rem] max-w-[calc(100vw-2rem)] grid-cols-1 rounded-b-xl bg-(--bg-4) shadow-lg sm:grid-cols-[1fr_auto_1fr]",
                            error &&
                                "border border-b-(--red) border-x-(--red) border-t-0",
                            dropdownClassName,
                        )}
                    >
                        <CalendarPanel
                            title="Від"
                            description="Початкова дата"
                            monthDate={fromMonth}
                            onMonthDateChange={setFromMonth}
                            range={selectedValue ?? {}}
                            selectedDate={selectedValue?.from}
                            minDate={minDate}
                            maxDate={selectedValue?.to ?? maxDate}
                            minYear={yearMin}
                            maxYear={yearMax}
                            onSelect={selectFromDate}
                        />

                        <div className="hidden w-px bg-white/10 sm:block" />

                        <CalendarPanel
                            title="До"
                            description="Кінцева дата"
                            monthDate={toMonth}
                            onMonthDateChange={setToMonth}
                            range={selectedValue ?? {}}
                            selectedDate={selectedValue?.to}
                            minDate={selectedValue?.from ?? minDate}
                            maxDate={maxDate}
                            minYear={yearMin}
                            maxYear={yearMax}
                            onSelect={selectToDate}
                        />
                    </div>
                )}
            </div>
        );
    },
);

DatePicker.displayName = "DatePicker";

export default DatePicker;