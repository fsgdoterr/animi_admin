import { useId, type ButtonHTMLAttributes, type MouseEvent } from "react";
import clsx from "clsx";
import Spinner from "~/components/ui/spinner";
import { Tooltip } from "react-tooltip";

import { Link, type LinkProps } from "react-router";

type ButtonColor =
    | "GREEN"
    | "PRIMARY"
    | "RED"
    | "YELLOW"
    | "BLUE"
    | "TRANSPARENT";
type ButtonRadius = "MD" | "LG" | "XL";

type CommonProps = {
    loading?: boolean;
    color?: ButtonColor;
    radius?: ButtonRadius;
    isQuad?: boolean;
    transparent?: boolean;
    tooltipText?: string;
    className?: string;
    children?: React.ReactNode;
};

type ButtonProps = CommonProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        isLink?: false;
    };

type ButtonLinkProps = CommonProps &
    Omit<LinkProps, "className" | "children"> & {
        isLink: true;
        disabled?: boolean;
    };

type Props = ButtonProps | ButtonLinkProps;

const solidColorClasses: Record<ButtonColor, string> = {
    PRIMARY: "bg-(--primary) hover:bg-(--primary)/80 text-white",
    GREEN: "bg-(--green) hover:bg-(--green)/80 text-white",
    RED: "bg-(--red) hover:bg-(--red)/80 text-white",
    YELLOW: "bg-(--yellow) hover:bg-(--yellow)/80 text-black",
    BLUE: "bg-(--blue) hover:bg-(--blue)/80 text-white",
    TRANSPARENT: "",
};

const transparentColorClasses: Record<ButtonColor, string> = {
    PRIMARY:
        "bg-(--primary)/30 border border-(--primary) text-(--primary) hover:bg-(--primary) hover:text-white",
    GREEN: "bg-(--green)/30 border border-(--green) text-(--green) hover:bg-(--green) hover:text-white",
    RED: "bg-(--red)/30 border border-(--red) text-(--red) hover:bg-(--red) hover:text-white",
    YELLOW: "bg-(--yellow)/30 border border-(--yellow) text-(--yellow) hover:bg-(--yellow) hover:text-black",
    BLUE: "bg-(--blue)/30 border border-(--blue) text-(--blue) hover:bg-(--blue) hover:text-white",
    TRANSPARENT: "",
};

const disabledSolidClasses = "bg-(--grey-2) text-(--grey-5) cursor-not-allowed";

const disabledTransparentClasses =
    "bg-transparent border border-(--grey-2) text-(--grey-2) cursor-not-allowed";

const radiusClasses: Record<ButtonRadius, string> = {
    MD: "rounded-md",
    LG: "rounded-xl",
    XL: "rounded-2xl",
};

export default function Button(props: Props) {
    const {
        children,
        className,
        loading,
        disabled,
        tooltipText,
        isQuad = false,
        transparent = false,
        color = "PRIMARY",
        radius = "MD",
    } = props;

    const btnDisabled = loading || disabled;
    const tooltipId = useId();

    const classes = clsx(
        "flex items-center justify-center gap-2 transition-colors duration-200",
        isQuad ? "py-2 px-2" : "py-2 px-4",

        !btnDisabled &&
            (transparent
                ? transparentColorClasses[color]
                : solidColorClasses[color]),

        btnDisabled &&
            (transparent ? disabledTransparentClasses : disabledSolidClasses),

        radiusClasses[radius],

        !btnDisabled && "cursor-pointer",

        className,
    );

    const content = (
        <>
            {loading && <Spinner />}
            {children}
            <Tooltip id={tooltipId} />
        </>
    );

    if (props.isLink) {
        const {
            isLink,
            children,
            className,
            loading,
            disabled,
            color,
            radius,
            tooltipText,
            isQuad,
            transparent,
            onClick,
            ...rest
        } = props;

        const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
            if (btnDisabled) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            onClick?.(event);
        };

        return (
            <Link
                {...rest}
                className={classes}
                aria-disabled={btnDisabled}
                tabIndex={btnDisabled ? -1 : rest.tabIndex}
                onClick={handleClick}
                data-tooltip-id={tooltipId}
                data-tooltip-content={tooltipText}
                data-tooltip-place="top"
            >
                {content}
            </Link>
        );
    }

    const {
        isLink,
        children: _children,
        className: _className,
        loading: _loading,
        disabled: _disabled,
        color: _color,
        radius: _radius,
        tooltipText: _tooltipText,
        isQuad: _isQuad,
        transparent: _transparent,
        ...rest
    } = props;

    return (
        <button
            {...rest}
            className={classes}
            disabled={btnDisabled}
            data-tooltip-id={tooltipId}
            data-tooltip-content={tooltipText}
            data-tooltip-place="top"
        >
            {content}
        </button>
    );
}
