import Button from "~/components/ui/buttons/button";
import { useLazyLogoutQuery } from "~/lib/store/animi/auth.endpoints";

export default function LogoutButton() {
    const [logout, { isLoading }] = useLazyLogoutQuery();
    const logoutHandler = async () => {
        try {
            await logout().unwrap();
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <Button
            color={"RED"}
            transparent
            className="text-sm py-1!"
            onClick={logoutHandler}
            disabled={isLoading}
        >
            Вийти
        </Button>
    );
}
