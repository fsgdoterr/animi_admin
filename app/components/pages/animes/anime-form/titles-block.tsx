import { useFormContext } from "react-hook-form";
import Input from "~/components/ui/inputs/input";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function TitlesBlock() {
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
            <div>Назви</div>
            <div className="flex gap-2.5">
                <div className="flex flex-col flex-1">
                    <div>Назва</div>
                    <div className="flex">
                        <Input
                            placeholder="Назва"
                            {...register("title", {
                                required: "Поле назви є обов'язковим.",
                            })}
                        />
                        {renderResetButton("title")}
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <div>Оригінальна назва</div>
                    <div className="flex">
                        <Input
                            placeholder="Оригінальна назва"
                            {...register("originalTitle")}
                        />
                        {renderResetButton("originalTitle")}
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <div>Англійська назва</div>
                    <div className="flex">
                        <Input
                            placeholder="Англійська назва"
                            {...register("engTitle")}
                        />
                        {renderResetButton("engTitle")}
                    </div>
                </div>
            </div>
        </div>
    );
}
