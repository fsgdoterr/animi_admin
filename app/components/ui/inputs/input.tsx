import clsx from "clsx";
import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type HTMLInputTypeAttribute,
    type InputHTMLAttributes,
    type JSX,
    type MouseEvent,
} from "react";
import { Tooltip } from "react-tooltip";

export interface InputProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
> {
    error?: boolean;
    inputClassName?: string;
    beforeIcon?: JSX.Element;
    tooltipText?: string;
    type?: "text" | "password" | "email" | "number";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            tooltipText,
            error,
            inputClassName,
            beforeIcon: BeforeIcon,
            className,
            type,
            ...rest
        },
        ref,
    ) => {
        const tooltipId = useId();
        const inputRef = useRef<HTMLInputElement | null>(null);

        const setInputRefs = useCallback(
            (node: HTMLInputElement | null) => {
                inputRef.current = node;

                if (typeof ref === "function") {
                    ref(node);
                } else if (ref) {
                    ref.current = node;
                }
            },
            [ref],
        );

        const [localType, setLocalType] = useState<
            HTMLInputTypeAttribute | undefined
        >(type || "text");

        useEffect(() => {
            setLocalType(type || "text");
        }, [type]);

        const classes = clsx(
            "flex w-full items-center gap-2.5 rounded-xl bg-(--bg-3) px-3 py-2",
            error && "ring-1 ring-(--red)/65",
            className,
        );

        const inputClasses = clsx(
            "min-w-0 flex-1 bg-transparent outline-none",
            inputClassName,
        );

        const localTypeClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            setLocalType((prev) => (prev === "password" ? "text" : "password"));
        };

        const containerClickHandler = (e: MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLElement;

            if (target.closest("button")) {
                return;
            }

            inputRef.current?.focus();
        };

        return (
            <div
                className={classes}
                onClick={containerClickHandler}
                data-tooltip-id={tooltipId}
                data-tooltip-content={tooltipText}
                data-tooltip-place="right"
            >
                {!!BeforeIcon && <div>{BeforeIcon}</div>}

                <input
                    ref={setInputRefs}
                    {...rest}
                    className={inputClasses}
                    type={localType}
                />

                {type === "password" && (
                    <button
                        className="flex items-center justify-center text-sm gap-2 cursor-pointer w-25"
                        onClick={localTypeClickHandler}
                        onMouseDown={(e) => e.preventDefault()}
                        type="button"
                    >
                        {localType === "password" ? "Показати" : "Сховати"}
                    </button>
                )}
                <Tooltip id={tooltipId} />
            </div>
        );
    },
);

export default Input;
