import { useId } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import GenresForm from "~/components/pages/genres/genres-form";
import Button from "~/components/ui/buttons/button";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import { useCreateGenreMutation } from "~/lib/store/animi/genres.endpoints";
import type { GenreFormType } from "~/lib/types/forms/genre.form-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

export default function CreateGenresPage() {
    const [createGenre, { isLoading }] = useCreateGenreMutation();
    const formId = useId();
    const navigate = useNavigate();

    const submit: SubmitHandler<GenreFormType> = async (data) => {
        try {
            await createGenre({
                title: data.title,
                poster: typeof data.poster === "string" ? data.poster : data.poster?.id,
            }).unwrap();

            toast.success("Жанр створено.");
            navigate("/genres");
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Не вдалося створити жанр."));
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                backUrl="/genres"
                title="Створити жанр"
                buttons={
                    <Button
                        form={formId}
                        loading={isLoading}
                        className="w-full sm:w-auto"
                    >
                        Створити
                    </Button>
                }
            />
            <PageCard>
                <GenresForm formId={formId} submit={submit} />
            </PageCard>
        </div>
    );
}
