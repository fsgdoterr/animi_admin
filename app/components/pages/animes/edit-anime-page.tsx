import { useId, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import PlayerForm from "~/components/pages/players/players-form";
import Button from "~/components/ui/buttons/button";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import { useUpdatePlayerMutation } from "~/lib/store/animi/players.endpoints";
import type { Player } from "~/lib/types/entities/player-type";
import type { PlayerFormType } from "~/lib/types/forms/player.form-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

export default function EditAnimePage({ anime }: { anime: Player }) {
    const formId = useId();
    const navigate = useNavigate();
    const [updatePlayer, { isLoading }] = useUpdatePlayerMutation();

    const defaultValues = useMemo<Partial<PlayerFormType>>(
        () => ({
            title: anime.title,
        }),
        [anime],
    );

    const submit: SubmitHandler<PlayerFormType> = async (data) => {
        try {
            await updatePlayer({
                id: anime.id,
                body: data,
            }).unwrap();

            toast.success("Плеєр оновлено.");
            navigate("/players");
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Не вдалося оновити плеєр."));
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                backUrl="/players"
                title="Редагування плеєра"
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
                #{anime.id} - {anime.title}
            </div>
            <PageCard>
                <PlayerForm
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
