import { Controller, useFormContext } from "react-hook-form";
import Select from "~/components/ui/select";
import { AnimeStatus } from "~/lib/constants/anime-status";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function StatusBlock() {
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
            <div>Статус</div>
            <div className="flex">
                <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <Select
                            beforeValue="Статус:"
                            placeholder="Оберіть статус"
                            values={[
                                { title: "Чернетка", value: AnimeStatus.DRAFT },
                                {
                                    title: "Анонс",
                                    value: AnimeStatus.ANNOUNCED,
                                },
                                {
                                    title: "Відмінено",
                                    value: AnimeStatus.CANCELLED,
                                },
                                {
                                    title: "Завершено",
                                    value: AnimeStatus.COMPLETED,
                                },
                                {
                                    title: "Онґоїнг",
                                    value: AnimeStatus.ONGOING,
                                },
                            ]}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                {renderResetButton("status")}
            </div>
        </div>
    );
}
