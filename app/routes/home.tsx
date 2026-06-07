import Input from "~/components/ui/inputs/input";
import type { Route } from "./+types/home";
import Button from "~/components/ui/buttons/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { KeyRound, UserRound } from "lucide-react";
import { useSigninMutation } from "~/lib/store/animi/auth.endpoints";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

interface FormData {
    usernameOrEmail: string;
    password: string;
}

export default function Home() {
    const [signin, { isLoading }] = useSigninMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const submitHandler: SubmitHandler<FormData> = async (credentials) => {
        try {
            await signin(credentials).unwrap();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <main className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-6">
            <div className="flex w-full max-w-[375px] flex-col gap-6 rounded-xl bg-(--bg-2) p-4 sm:p-5">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl">Авторизація</h1>
                    <p className="text-sm text-(--grey-2)">
                        Увійдіть в адмін-панель Animi
                    </p>
                </div>

                <form
                    className="flex flex-col gap-2.5"
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <Input
                        beforeIcon={<UserRound size={16} />}
                        placeholder="Пошта або ім'я користувача"
                        error={Boolean(errors.usernameOrEmail)}
                        {...register("usernameOrEmail", {
                            required: true,
                        })}
                    />
                    <Input
                        beforeIcon={<KeyRound size={16} />}
                        type="password"
                        placeholder="Пароль"
                        error={Boolean(errors.password)}
                        {...register("password", {
                            required: true,
                        })}
                    />
                    <Button loading={isLoading} className="w-full">
                        Увійти
                    </Button>
                </form>
            </div>
        </main>
    );
}
