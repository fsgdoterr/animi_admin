import { useId } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import ReleaseTeamForm from "~/components/pages/releaseteams/releaseteams-form";
import Button from "~/components/ui/buttons/button";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import { useCreateReleaseTeamMutation } from "~/lib/store/animi/releaseteams.endpoints";
import type { ReleaseTeamFormType } from "~/lib/types/forms/release-team.form-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

export default function CreateReleaseTeamsPage() {
    const [createReleaseTeam, { isLoading }] = useCreateReleaseTeamMutation();
    const formId = useId();
    const navigate = useNavigate();

    const submit: SubmitHandler<ReleaseTeamFormType> = async (data) => {
        try {
            await createReleaseTeam(data).unwrap();

            toast.success("Команду озвучення створено.");
            navigate("/releaseteams");
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, "Не вдалося створити команду озвучення."),
            );
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                backUrl="/releaseteams"
                title="Створити команду озвучення"
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
                <ReleaseTeamForm formId={formId} submit={submit} />
            </PageCard>
        </div>
    );
}
