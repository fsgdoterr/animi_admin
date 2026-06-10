import { Controller, useFormContext } from "react-hook-form";
import RelationInput from "~/components/ui/relation-input";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function RelationBlock() {
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
            <div className="flex items-center gap-2.5">
                <span>Пов'язане</span>
                {renderResetButton("relation")}
            </div>
            <Controller
                control={control}
                name="relation"
                render={({ field }) => (
                    <RelationInput
                        value={field.value}
                        onChange={field.onChange}
                        loading={false}
                    />
                )}
            />
        </div>
    );
}
