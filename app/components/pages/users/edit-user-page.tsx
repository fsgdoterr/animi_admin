import { useId, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import UserForm from "~/components/pages/users/user-form";
import Button from "~/components/ui/buttons/button";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import { useUpdateUserMutation } from "~/lib/store/animi/users.endpoint";
import type { User } from "~/lib/types/entities/user-type";
import type { UserFormType } from "~/lib/types/forms/user.form-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

export default function EditUserPage({ user }: { user: User }) {
    const formId = useId();
    const navigate = useNavigate();
    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const defaultValues = useMemo<Partial<UserFormType>>(
        () => ({
            email: user.email,
            username: user.username,
            password: "",
            displayName: user.displayName ?? "",
            avatarId: user.avatar?.id,
            permissions: user.permissions,
        }),
        [user],
    );

    const submit: SubmitHandler<UserFormType> = async (data) => {
        try {
            await updateUser({
                id: user.id,
                body: {
                    email: data.email,
                    username: data.username,
                    displayName: data.displayName || undefined,
                    avatarId: data.avatarId,
                    permissions: data.permissions,
                    ...(data.password ? { password: data.password } : {}),
                },
            }).unwrap();

            toast.success("Користувача оновлено.");
            navigate("/users");
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, "Не вдалося оновити користувача."),
            );
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                backUrl="/users"
                title="Редагування користувача"
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
                #{user.id} - {user.username}
            </div>
            <PageCard>
                <UserForm
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
