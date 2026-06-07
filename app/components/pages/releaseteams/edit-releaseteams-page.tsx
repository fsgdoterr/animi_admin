import { useId, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import ReleaseTeamForm from "~/components/pages/releaseteams/releaseteams-form";
import Button from "~/components/ui/buttons/button";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import { useUpdateReleaseTeamMutation } from "~/lib/store/animi/releaseteams.endpoints";
import type { ReleaseTeam } from "~/lib/types/entities/release-team-type";
import type { ReleaseTeamFormType } from "~/lib/types/forms/release-team.form-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

export default function EditReleaseTeamsPage({ releaseTeam }: { releaseTeam: ReleaseTeam }) {
    const formId = useId();
    const navigate = useNavigate();
    const [updateReleaseTeam, { isLoading }] = useUpdateReleaseTeamMutation();

    const defaultValues = useMemo<Partial<ReleaseTeamFormType>>(
        () => ({
            title: releaseTeam.title
        }),
        [releaseTeam],
    );

    const submit: SubmitHandler<ReleaseTeamFormType> = async (data) => {
        try {
            await updateReleaseTeam({
                id: releaseTeam.id,
                body: data,
            }).unwrap();

            toast.success("Команду озвучення оновлено.");
            navigate("/releaseteams");
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, "Не вдалося оновити команду озвучення."),
            );
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                backUrl="/releaseteams"
                title="Редагування команди озвучення"
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
                #{releaseTeam.id} - {releaseTeam.title}
            </div>
            <PageCard>
                <ReleaseTeamForm
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
