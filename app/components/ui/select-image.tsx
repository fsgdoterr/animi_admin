import clsx from "clsx";
import { Upload } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import SelectImageModal from "~/components/modals/select-image-modal";
import Button from "~/components/ui/buttons/button";
import Input from "~/components/ui/inputs/input";
import { API_URL } from "~/lib/constants/api";
import type { Image } from "~/lib/types/entities/image-type";

interface Props {
    className?: string;
    error?: boolean;
    value?: string | Image | null;
    onChange?: (val: string | Image) => void;
}

export default function SelectImage({
    className,
    error,
    value,
    onChange,
}: Props) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const classes = clsx(
        "rounded-xl bg-(--grey-2) relative",
        error && "ring-1 ring-(--red)/65",
        className,
    );

    const onSelectImage = (img: Image) => {
        onChange?.(img);
    };

    const unselect = () => {
        onChange?.("");
    };

    return (
        <div className={classes}>
            {value ? (
                typeof value === "string" ? (
                    <img
                        src={`${API_URL}/api/image/proxy?url=${encodeURIComponent(value)}`}
                        alt="Select image"
                        className="w-full h-full rounded-xl object-cover"
                    />
                ) : (
                    <img
                        src={`${API_URL}/uploads/${value.path}`}
                        alt="Select image"
                        className="w-full h-full rounded-xl object-cover"
                    />
                )
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <Upload size={32} color="#000" />
                </div>
            )}
            <div className="absolute w-full h-full left-0 top-0 flex flex-col items-center justify-center p-2 bg-black/40">
                {typeof value === "string" || !value ? (
                    <>
                        <Button
                            transparent
                            color="GREEN"
                            onClick={() => setShowModal(true)}
                            type="button"
                        >
                            Обрати
                        </Button>
                        <span className="text-sm">або</span>
                        <Input
                            className={clsx("opacity-65")}
                            placeholder="Лінк"
                            error={error}
                            value={value || ""}
                            onChange={(e) => onChange?.(e.target.value)}
                        />
                    </>
                ) : (
                    <>
                        <span className="text-sm">Обрано з галереї</span>
                        <Button
                            onClick={unselect}
                            transparent
                            isQuad
                            color="RED"
                        >
                            Переобрати
                        </Button>
                    </>
                )}
            </div>
            {showModal &&
                createPortal(
                    <SelectImageModal
                        onHide={() => setShowModal(false)}
                        onSelect={onSelectImage}
                    />,
                    document.body,
                )}
        </div>
    );
}
