import clsx from "clsx";
import { X } from "lucide-react";
import {
    forwardRef,
    useEffect,
    useMemo,
    useRef,
    useState,
    type InputHTMLAttributes,
    type KeyboardEvent,
} from "react";

interface Props extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type" | "defaultValue"
> {
    className?: string;
    inputClasses?: string;
    error?: boolean;

    value: string[];
    onChange: (values: string[]) => void;

    defaultOptions?: string[];
    buttonText?: string;
    allowDuplicates?: boolean;
}

const normalize = (value: string) => value.trim().toLowerCase();

const AddInput = forwardRef<HTMLInputElement, Props>(({
    className,
    inputClasses,
    error,
    value,
    onChange,
    defaultOptions = [],
    buttonText = "Додати",
    allowDuplicates = false,
    placeholder,
    disabled,
    ...rest
}, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const rootRef = useRef<HTMLDivElement>(null);

    const trimmedInputValue = inputValue.trim();

    const findDefaultOption = (option: string) => {
        return defaultOptions.find(
            defaultOption => normalize(defaultOption) === normalize(option)
        );
    };

    const isNewValue = (option: string) => {
        return !findDefaultOption(option);
    };

    const filteredOptions = useMemo(() => {
        return defaultOptions.filter(option => {
            const optionNormalized = normalize(option);
            const inputNormalized = normalize(trimmedInputValue);

            const isMatching = !inputNormalized
                ? true
                : optionNormalized.includes(inputNormalized);

            const isAlreadySelected = value.some(
                selectedValue => normalize(selectedValue) === optionNormalized
            );

            return isMatching && (allowDuplicates || !isAlreadySelected);
        });
    }, [defaultOptions, trimmedInputValue, value, allowDuplicates]);

    const addValue = (rawValue = inputValue) => {
        const trimmed = rawValue.trim();

        if (!trimmed) return;

        const defaultOption = findDefaultOption(trimmed);
        const finalValue = defaultOption ?? trimmed;

        const alreadyExists = value.some(
            selectedValue => normalize(selectedValue) === normalize(finalValue)
        );

        if (!allowDuplicates && alreadyExists) {
            setInputValue("");
            setDropdownOpen(false);
            setActiveIndex(-1);
            return;
        }

        onChange([...value, finalValue]);
        setInputValue("");
        setDropdownOpen(false);
        setActiveIndex(-1);
    };

    const removeValue = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const keyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();

            setDropdownOpen(true);

            if (filteredOptions.length === 0) return;

            setActiveIndex(prev => {
                if (prev < 0) return 0;
                return (prev + 1) % filteredOptions.length;
            });
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            setDropdownOpen(true);

            if (filteredOptions.length === 0) return;

            setActiveIndex(prev => {
                if (prev < 0) return filteredOptions.length - 1;
                return prev === 0 ? filteredOptions.length - 1 : prev - 1;
            });
        }

        if (event.key === "Enter") {
            event.preventDefault();

            if (
                dropdownOpen &&
                activeIndex >= 0 &&
                filteredOptions[activeIndex]
            ) {
                addValue(filteredOptions[activeIndex]);
                return;
            }

            addValue();
        }

        if (event.key === "Escape") {
            setDropdownOpen(false);
            setActiveIndex(-1);
        }
    };

    useEffect(() => {
        setActiveIndex(-1);
    }, [inputValue]);

    useEffect(() => {
        const clickHandler = (event: MouseEvent) => {
            if (!rootRef.current) return;

            if (!rootRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener("mousedown", clickHandler);

        return () => {
            document.removeEventListener("mousedown", clickHandler);
        };
    }, []);

    return (
        <div
            ref={rootRef}
            className={clsx(
                "relative w-full",
                className
            )}
        >
            <div
                className={clsx(
                    "w-full rounded-xl bg-(--bg-3) border-2 px-3 py-2",
                    !error && "border-(--transparent)",
                    error && "border-(--red)",
                    disabled && "opacity-60 pointer-events-none"
                )}
            >
                {value.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                        {value.map((item, index) => {
                            const newValue = isNewValue(item);

                            return (
                                <div
                                    key={`${item}-${index}`}
                                    title={newValue ? `${item} (нове)` : item}
                                    className="flex items-center gap-1.5 rounded-lg bg-(--bg-2) px-2.5 py-1 text-sm"
                                >
                                    <button
                                        type="button"
                                        className="cursor-pointer opacity-70 transition hover:opacity-100"
                                        onClick={() => removeValue(index)}
                                    >
                                        <X size={14} />
                                    </button>

                                    <span>
                                        {item}
                                        {newValue && (
                                            <span className="opacity-70">
                                                {" "}
                                                (нове)
                                            </span>
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <input
                        {...rest}
                        ref={ref}
                        type="text"
                        value={inputValue}
                        disabled={disabled}
                        placeholder={placeholder}
                        onFocus={() => {
                            setDropdownOpen(true);
                            setActiveIndex(-1);
                        }}
                        onChange={(event) => {
                            setInputValue(event.target.value);
                            setDropdownOpen(true);
                        }}
                        onKeyDown={keyDownHandler}
                        className={clsx(
                            "w-full bg-transparent outline-none",
                            inputClasses
                        )}
                    />

                    <button
                        type="button"
                        onClick={() => addValue()}
                        disabled={!trimmedInputValue}
                        className={clsx(
                            "shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-sm transition",
                            "bg-(--accent) text-white",
                            "disabled:cursor-not-allowed disabled:opacity-50"
                        )}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>

            {dropdownOpen && filteredOptions.length > 0 && (
                <div
                    className={clsx(
                        "absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-xl",
                        "border-2 border-(--transparent) bg-(--bg-3) shadow-xl"
                    )}
                >
                    {filteredOptions.map((option, index) => {
                        const active = index === activeIndex;

                        return (
                            <button
                                key={option}
                                type="button"
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseDown={(event) => {
                                    event.preventDefault();
                                    addValue(option);
                                }}
                                className={clsx(
                                    "block w-full cursor-pointer px-3 py-2 text-left text-sm transition",
                                    active && "bg-(--bg-2)",
                                    !active && "hover:bg-(--bg-2)"
                                )}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

export default AddInput;