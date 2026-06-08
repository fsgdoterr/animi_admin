import { useFormContext } from "react-hook-form";
import Input from "~/components/ui/inputs/input";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function LinksBlock() {
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
            <div>Лінки</div>
            <div className="flex flex-col">
                <div>MAL</div>
                <div className="flex">
                    <Input placeholder="MAL" {...register("mal")} />
                    {renderResetButton("mal")}
                </div>
            </div>
            <div className="flex flex-col">
                <div>AL</div>
                <div className="flex">
                    <Input placeholder="AL" {...register("al")} />
                    {renderResetButton("al")}
                </div>
            </div>
        </div>
    );
}
