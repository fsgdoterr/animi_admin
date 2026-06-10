import { useFormContext } from "react-hook-form";
import Input from "~/components/ui/inputs/input";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function DescriptionBlock() {
    const {
        register,
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
            <div>Опис</div>
            <div className="flex">
                <textarea
                    {...register("description")}
                    className="w-full bg-(--bg-3) resize-none rounded-xl p-2.5 h-48 outline-none"
                    placeholder="Опис"
                ></textarea>
                {renderResetButton("description")}
            </div>
        </div>
    );
}
