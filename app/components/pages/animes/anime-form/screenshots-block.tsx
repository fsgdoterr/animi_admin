import { X } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import uuid from "react-uuid";
import Button from "~/components/ui/buttons/button";
import SelectImage from "~/components/ui/select-image";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { Image } from "~/lib/types/entities/image-type";
import type {
    AnimeFormType,
    ScreenshotType,
} from "~/lib/types/forms/anime.form-type";

export default function ScreenshotsBlock() {
    const {
        control,
        watch,
        resetField,
        formState: { dirtyFields },
    } = useFormContext<AnimeFormType>();

    const showResetButtons = useAppSelector(
        (state) => state.animePage.showResetButtons,
    );

    const renderResetButton = useResetFieldButton<AnimeFormType>({
        dirtyFields,
        resetField,
        showResetButtons,
    });

    const images = watch("screenshots");

    const { append, remove } = useFieldArray({
        control,
        name: "screenshots",
    });

    const addImage = () => {
        append({
            id: uuid(),
            img: "",
        });
    };

    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
                <div>Додаткові зображення</div>
                <div className="flex gap-1">
                    {renderResetButton("screenshots")}
                    <Button
                        transparent
                        color="GREEN"
                        isQuad
                        onClick={addImage}
                        type="button"
                    >
                        Додати
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
                {images?.map((img, i) => (
                    <Controller
                        control={control}
                        name={`screenshots.${i}`}
                        key={uuid()}
                        render={({ field }) => (
                            <div className="w-full aspect-square relative">
                                <CustomSelectImage
                                    value={field.value!}
                                    onChange={field.onChange}
                                />
                                <button
                                    className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 p-2 bg-(--red)/35 text-(--red) ring-1 ring-(--red) hover:bg-(--red) hover:text-white rounded-full z-10 cursor-pointer duration-200 transition-colors"
                                    type="button"
                                    onClick={() => remove(i)}
                                >
                                    <X />
                                </button>
                            </div>
                        )}
                    />
                ))}
            </div>
        </div>
    );
}

interface CustomSelectImageProps {
    value: ScreenshotType;
    onChange: (vl: ScreenshotType) => void;
}

const CustomSelectImage = ({ value, onChange }: CustomSelectImageProps) => {
    const update = (vl: Image | string) => {
        if (typeof vl === "string") {
            if ("img" in value) {
                onChange({
                    id: value.id,
                    img: vl,
                });
            } else {
                onChange({
                    id: uuid(),
                    img: vl,
                });
            }
        } else {
            onChange(vl);
        }
    };

    const vl = "img" in value ? value.img : value;

    return (
        <SelectImage
            value={vl}
            onChange={update}
            className="w-full aspect-square"
        />
    );
};
