import { useFormContext } from "react-hook-form";
import Input from "~/components/ui/inputs/input";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function AdditionalBlock() {
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
            <div>Додатково</div>
            <div className="flex gap-2.5">
                <div className="flex flex-col flex-1">
                    <div>Країна</div>
                    <div className="flex">
                        <Input placeholder="Країна" {...register("country")} />
                        {renderResetButton("country")}
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <div>Тривалість(хв)</div>
                    <div className="flex">
                        <Input
                            placeholder="Тривалість(хв)"
                            type="number"
                            {...register("duration")}
                        />
                        {renderResetButton("duration")}
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <div>Студія</div>
                    <div className="flex">
                        <Input placeholder="Студія" {...register("studio")} />
                        {renderResetButton("studio")}
                    </div>
                </div>
            </div>
        </div>
    );
}
