import { Controller, useFormContext } from "react-hook-form";
import SelectImage from "~/components/ui/select-image";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function PosterBlock() {
    const {
        control,
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

    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
                <span>Постер</span>
                {renderResetButton("poster")}
            </div>
            <Controller
                control={control}
                name="poster"
                render={({ field }) => (
                    <SelectImage
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full aspect-2/3"
                    />
                )}
            />
        </div>
    );
}
