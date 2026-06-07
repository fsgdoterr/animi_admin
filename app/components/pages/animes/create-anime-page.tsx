import { useId } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import PlayerForm from "~/components/pages/players/players-form";
import Button from "~/components/ui/buttons/button";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import { useCreatePlayerMutation } from "~/lib/store/animi/players.endpoints";
import type { PlayerFormType } from "~/lib/types/forms/player.form-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

export default function CreateAnimePage() {
    const [createPlayer, { isLoading }] = useCreatePlayerMutation();
    const formId = useId();
    const navigate = useNavigate();

    const submit: SubmitHandler<PlayerFormType> = async (data) => {
        try {
            await createPlayer(data).unwrap();

            toast.success("Плеєр створено.");
            navigate("/players");
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, "Не вдалося створити плеєр."),
            );
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                backUrl="/players"
                title="Створити плеєр"
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
                <PlayerForm formId={formId} submit={submit} />
            </PageCard>
        </div>
    );
}
