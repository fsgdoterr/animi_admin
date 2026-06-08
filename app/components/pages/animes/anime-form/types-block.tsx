import { Controller, useFormContext } from "react-hook-form";
import Input from "~/components/ui/inputs/input";
import Select from "~/components/ui/select";
import { AnimeType } from "~/lib/constants/anime-type";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function TypesBlock() {
    const {
        register,
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

    const animeType = watch("type");

    return (
        <div className="flex flex-col gap-2.5">
            <div>Тип/Епізоди/Частина/Сезон</div>
            <div className="flex gap-2.5">
                <div className="flex flex-1">
                    <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <Select
                                className="w-full"
                                beforeValue="Тип:"
                                placeholder="Оберіть тип"
                                value={field.value}
                                onChange={field.onChange}
                                values={[
                                    { title: "TV-аніме", value: AnimeType.TV },
                                    { title: "Фільм", value: AnimeType.MOVIE },
                                    { title: "OVA", value: AnimeType.OVA },
                                    { title: "ONA", value: AnimeType.ONA },
                                    {
                                        title: "Спешл",
                                        value: AnimeType.SPECIAL,
                                    },
                                ]}
                            />
                        )}
                    />
                    {renderResetButton("type")}
                </div>
                <div className="flex-1" />
                <div className="flex-1" />
            </div>
            <div className="flex gap-2.5">
                {animeType === AnimeType.TV ? (
                    <>
                        <div className="flex flex-col flex-1">
                            <div>Кількість епізодів</div>
                            <div className="flex">
                                <Input
                                    placeholder="Кількість епізодів"
                                    type="number"
                                    className="w-full"
                                    {...register("episodesTotal")}
                                />
                                {renderResetButton("episodesTotal")}
                            </div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div>Номер сезону</div>
                            <div className="flex">
                                <Input
                                    placeholder="Номер сезону"
                                    type="number"
                                    className="flex-1"
                                    {...register("seasonNumber")}
                                />
                                {renderResetButton("seasonNumber")}
                            </div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div>Номер частини</div>
                            <div className="flex">
                                <Input
                                    placeholder="Номер частини"
                                    type="number"
                                    className="flex-1"
                                    {...register("partNumber")}
                                />
                                {renderResetButton("partNumber")}
                            </div>
                        </div>
                    </>
                ) : animeType === AnimeType.MOVIE ? (
                    <>
                        <div className="flex flex-col flex-1">
                            <div>Номер частини</div>
                            <div className="flex">
                                <Input
                                    placeholder="Номер частини"
                                    type="number"
                                    className="flex-1"
                                    {...register("partNumber")}
                                />
                                {renderResetButton("partNumber")}
                            </div>
                        </div>
                        <div className="flex-1" />
                        <div className="flex-1" />
                    </>
                ) : null}
            </div>
        </div>
    );
}
