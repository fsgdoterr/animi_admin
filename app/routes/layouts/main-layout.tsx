import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Loader from "~/components/ui/loader";
import { useGetMeQuery } from "~/lib/store/animi/auth.endpoints";

const FullPageLoader = () => {
    return (
        <div className="min-h-dvh flex items-center justify-center">
            <Loader />
        </div>
    );
};

export default function MainLayout() {
    const { data, isLoading, isFetching, isError, isSuccess, isUninitialized } =
        useGetMeQuery();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const isIndexPage = pathname === "/";

    const isCheckingAuth = isUninitialized || isLoading || isFetching;
    const isAuthResolved = isSuccess || isError;

    const isAuthorized = isSuccess && Boolean(data);

    useEffect(() => {
        if (isCheckingAuth || !isAuthResolved) return;

        if (isAuthorized && isIndexPage) {
            navigate("/dashboard", { replace: true });
            return;
        }

        if (!isAuthorized && !isIndexPage) {
            navigate("/", { replace: true });
            return;
        }
    }, [isCheckingAuth, isAuthResolved, isAuthorized, isIndexPage, navigate]);

    if (isCheckingAuth || !isAuthResolved) {
        return <FullPageLoader />;
    }

    if (isAuthorized && isIndexPage) {
        return <FullPageLoader />;
    }

    if (!isAuthorized && !isIndexPage) {
        return <FullPageLoader />;
    }
    
    return <Outlet />;
}
