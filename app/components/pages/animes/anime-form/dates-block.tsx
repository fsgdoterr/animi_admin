import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "~/components/ui/date-picker";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function DatesBlock() {
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
            <div>Дати</div>
            <div className="flex">
                <Controller
                    control={control}
                    name="releaseDate"
                    render={({ field }) => (
                        <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            className="w-full"
                        />
                    )}
                />
                {renderResetButton("releaseDate")}
            </div>
        </div>
    );
}
