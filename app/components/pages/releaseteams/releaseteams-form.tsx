import {
    useForm,
    type SubmitErrorHandler,
    type SubmitHandler,
} from "react-hook-form";
import Input from "~/components/ui/inputs/input";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { ReleaseTeamFormType } from "~/lib/types/forms/release-team.form-type";
import { showFormErrorsToast } from "~/lib/utils/form-errors";

interface Props {
    submit: SubmitHandler<ReleaseTeamFormType>;
    formId?: string;
    defaultValues?: Partial<ReleaseTeamFormType>;
    showResetButtons?: boolean;
    isEdit?: boolean;
}

export default function ReleaseTeamForm({
    submit,
    formId,
    defaultValues,
    showResetButtons = false,
    isEdit = false,
}: Props) {
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors, dirtyFields },
    } = useForm<ReleaseTeamFormType>({
        defaultValues: {
            title: "",
            ...defaultValues,
        },
    });

    const invalidSubmitHandler: SubmitErrorHandler<ReleaseTeamFormType> = (
        formErrors,
    ) => showFormErrorsToast(formErrors);

    const renderResetButton = useResetFieldButton<ReleaseTeamFormType>({
        dirtyFields,
        resetField,
        showResetButtons,
    });

    return (
        <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(submit, invalidSubmitHandler)}
            id={formId}
        >
            <label className="flex flex-col gap-1">
                <span>Назва</span>
                <div className="flex gap-2">
                    <Input
                        className="min-w-0 flex-1"
                        placeholder="Назва"
                        error={!!errors.title}
                        tooltipText={errors.title?.message}
                        {...register("title", {
                            required: "Назва є обов'язковою.",
                        })}
                    />
                    {renderResetButton("title")}
                </div>
            </label>
        </form>
    );
}
