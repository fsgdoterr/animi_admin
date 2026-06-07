import { useId, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import GenresForm from "~/components/pages/genres/genres-form";
import Button from "~/components/ui/buttons/button";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import { useUpdateGenreMutation } from "~/lib/store/animi/genres.endpoints";
import type { Genre } from "~/lib/types/entities/genre-type";
import type { GenreFormType } from "~/lib/types/forms/genre.form-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

export default function EditGenresPage({ genre }: { genre: Genre }) {
    const formId = useId();
    const navigate = useNavigate();
    const [updateGenre, { isLoading }] = useUpdateGenreMutation();

    const defaultValues = useMemo<Partial<GenreFormType>>(
        () => ({
            title: genre.title,
            poster: genre.poster,
        }),
        [genre],
    );

    const submit: SubmitHandler<GenreFormType> = async (data) => {
        try {
            await updateGenre({
                id: genre.id,
                body: {
                    title: data.title,
                    poster: !!data.poster
                        ? typeof data.poster === "string"
                            ? data.poster
                            : data.poster.id
                        : null,
                },
            }).unwrap();

            toast.success("Жанр оновлено.");
            navigate("/genres");
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Не вдалося оновити жанр."));
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                backUrl="/genres"
                title="Редагування жанру"
                buttons={
                    <Button
                        form={formId}
                        loading={isLoading}
                        className="w-full sm:w-auto"
                    >
                        Зберегти
                    </Button>
                }
            />
            <div className="text-lg text-(--grey-2)">
                #{genre.id} - {genre.title}
            </div>
            <PageCard>
                <GenresForm
                    formId={formId}
                    submit={submit}
                    defaultValues={defaultValues}
                    showResetButtons
                    isEdit
                />
            </PageCard>
        </div>
    );
}
