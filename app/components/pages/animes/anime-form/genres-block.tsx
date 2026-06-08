import { Controller, useFormContext } from "react-hook-form";
import AddInput from "~/components/ui/inputs/add-input";
import { useAppSelector } from "~/lib/hooks/redux";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import { useGetAllGenresQuery } from "~/lib/store/animi/genres.endpoints";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function GenresBlock() {
    const { data } = useGetAllGenresQuery({
        limit: 100,
        page: 1,
    });

    const allGenres = data?.items ?? [];

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
            <div>Жанри</div>
            <div className="flex">
                <Controller
                    control={control}
                    name="genres"
                    render={({ field }) => (
                        <AddInput
                            value={field.value ?? []}
                            onChange={field.onChange}
                            className="w-full"
                            defaultOptions={allGenres.map((g) => g.title)}
                        />
                    )}
                />
                {renderResetButton("genres")}
            </div>
        </div>
    );
}
