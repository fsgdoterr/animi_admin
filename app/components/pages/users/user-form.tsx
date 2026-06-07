import {
    Controller,
    useForm,
    type SubmitErrorHandler,
    type SubmitHandler,
} from "react-hook-form";
import Input from "~/components/ui/inputs/input";
import Select from "~/components/ui/select";
import { Permissions } from "~/lib/constants/permissions";
import { useResetFieldButton } from "~/lib/hooks/use-reset-field-button";
import type { UserFormType } from "~/lib/types/forms/user.form-type";
import { showFormErrorsToast } from "~/lib/utils/form-errors";

interface Props {
    submit: SubmitHandler<UserFormType>;
    formId?: string;
    defaultValues?: Partial<UserFormType>;
    showResetButtons?: boolean;
    isEdit?: boolean;
}

const permissionValues = [
    {
        title: "Користувач",
        value: Permissions.USER,
    },
    { title: "Модер", value: Permissions.MODER },
    { title: "Адмін", value: Permissions.ADMIN },
    {
        title: "Супер адмін",
        value: Permissions.SUPER_ADMIN,
    },
];

export default function UserForm({
    submit,
    formId,
    defaultValues,
    showResetButtons = false,
    isEdit = false,
}: Props) {
    const {
        register,
        handleSubmit,
        control,
        resetField,
        formState: { errors, dirtyFields },
    } = useForm<UserFormType>({
        defaultValues: {
            email: "",
            username: "",
            password: "",
            displayName: "",
            permissions: [Permissions.USER],
            ...defaultValues,
        },
    });

    const invalidSubmitHandler: SubmitErrorHandler<UserFormType> = (
        formErrors,
    ) => showFormErrorsToast(formErrors);

    const renderResetButton = useResetFieldButton<UserFormType>({
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
                <span>Пошта</span>
                <div className="flex gap-2">
                    <Input
                        className="min-w-0 flex-1"
                        placeholder="Пошта"
                        error={!!errors.email}
                        tooltipText={errors.email?.message}
                        {...register("email", {
                            required: "Пошта є обов'язковою.",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Невірний формат пошти.",
                            },
                        })}
                    />
                    {renderResetButton("email")}
                </div>
            </label>

            <label className="flex flex-col gap-1">
                <span>Ім'я користувача</span>
                <div className="flex gap-2">
                    <Input
                        className="min-w-0 flex-1"
                        placeholder="Ім'я користувача"
                        error={!!errors.username}
                        tooltipText={errors.username?.message}
                        {...register("username", {
                            required: "Ім'я користувача є обов'язковим",
                            minLength: {
                                value: 3,
                                message:
                                    "Мінімальна кількість символів імені користувача - 3",
                            },
                            maxLength: {
                                value: 40,
                                message:
                                    "Максимальна кількість символів імені користувача - 40",
                            },
                        })}
                    />
                    {renderResetButton("username")}
                </div>
            </label>

            <label className="flex flex-col gap-1">
                <span>Пароль</span>
                <div className="flex gap-2">
                    <Input
                        className="min-w-0 flex-1"
                        placeholder={
                            isEdit
                                ? "Залиште пустим, якщо пароль не змінюється"
                                : "Пароль"
                        }
                        error={!!errors.password}
                        tooltipText={errors.password?.message}
                        type="password"
                        {...register("password", {
                            required: isEdit ? false : "Пароль є обов'язковим.",
                            minLength: {
                                value: 6,
                                message:
                                    "Мінімальна кількість символів паролю - 6",
                            },
                            maxLength: {
                                value: 40,
                                message:
                                    "Максимальна кількість символів паролю - 40",
                            },
                        })}
                    />
                    {renderResetButton("password")}
                </div>
            </label>

            <label className="flex flex-col gap-1">
                <span>Відображене ім'я</span>
                <div className="flex gap-2">
                    <Input
                        className="min-w-0 flex-1"
                        placeholder="Відображене ім'я"
                        error={!!errors.displayName}
                        tooltipText={errors.displayName?.message}
                        {...register("displayName")}
                    />
                    {renderResetButton("displayName")}
                </div>
            </label>

            <label className="flex flex-col gap-1">
                <span>Аватар</span>
                <div className="rounded-xl bg-(--bg-3) px-3 py-2 text-(--grey-2)">
                    Вибір аватара поки не реалізований
                </div>
            </label>

            <label className="flex flex-col gap-1">
                <span>Ролі</span>
                <div className="flex gap-2">
                    <Controller
                        control={control}
                        name="permissions"
                        render={({ field }) => (
                            <Select
                                className="min-w-0 flex-1"
                                placeholder="Ролі"
                                error={!!errors.permissions}
                                values={permissionValues}
                                value={field.value?.[0] ?? Permissions.USER}
                                beforeValue="Ролі:"
                                onChange={(permission) =>
                                    field.onChange([permission])
                                }
                            />
                        )}
                    />
                    {renderResetButton("permissions")}
                </div>
            </label>
        </form>
    );
}
