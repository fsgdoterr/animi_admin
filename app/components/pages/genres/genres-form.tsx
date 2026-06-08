import {
    Controller,
    useForm,
    type SubmitErrorHandler,
    type SubmitHandler,
} from "react-hook-form";
import Input from "~/components/ui/inputs/input";
import SelectImage from "~/components/ui/select-image";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { GenreFormType } from "~/lib/types/forms/genre.form-type";
import { showFormErrorsToast } from "~/lib/utils/form-errors";

interface Props {
    submit: SubmitHandler<GenreFormType>;
    formId?: string;
    defaultValues?: Partial<GenreFormType>;
    showResetButtons?: boolean;
    isEdit?: boolean;
}

export default function GenresForm({
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
        control,
        formState: { errors, dirtyFields },
    } = useForm<GenreFormType>({
        defaultValues: {
            title: "",
            poster: "",
            ...defaultValues,
        },
    });

    const invalidSubmitHandler: SubmitErrorHandler<GenreFormType> = (
        formErrors,
    ) => showFormErrorsToast(formErrors);

    const renderResetButton = useResetFieldButton<GenreFormType>({
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
            <div className="flex flex-col gap-1">
                <span>Аватар</span>
                <div className="flex gap-2">
                    <Controller 
                        control={control}
                        name="poster"
                        render={({field}) =>
                            <SelectImage 
                                value={field.value}
                                onChange={field.onChange}
                                className="w-32 h-32"
                            />
                        }
                    />
                    {renderResetButton("poster")}
                </div>
            </div>
        </form>
    );
}
