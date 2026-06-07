import { useId } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import UserForm from "~/components/pages/users/user-form";
import Button from "~/components/ui/buttons/button";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import { useCreateUserMutation } from "~/lib/store/animi/users.endpoints";
import type { UserFormType } from "~/lib/types/forms/user.form-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

export default function CreateUserPage() {
    const [createUser, { isLoading }] = useCreateUserMutation();
    const formId = useId();
    const navigate = useNavigate();

    const submit: SubmitHandler<UserFormType> = async (data) => {
        try {
            await createUser({
                email: data.email,
                username: data.username,
                password: data.password ?? "",
                displayName: data.displayName || undefined,
                avatarId: data.avatarId,
                permissions: data.permissions,
            }).unwrap();

            toast.success("Користувача створено.");
            navigate("/users");
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, "Не вдалося створити користувача."),
            );
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                backUrl="/users"
                title="Створити користувача"
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
                <UserForm formId={formId} submit={submit} />
            </PageCard>
        </div>
    );
}
