import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router";
import EditUserPage from "~/components/pages/users/edit-user-page";
import Loader from "~/components/ui/loader";
import PageCard from "~/components/ui/page-card";
import { useGetOneUserQuery } from "~/lib/store/animi/users.endpoint";

export default function EditUser() {
    const { id } = useParams();
    const userId = id ? Number(id) : Number.NaN;
    const isValidUserId = Number.isFinite(userId);

    const { data, isLoading, isFetching, isError } = useGetOneUserQuery(
        isValidUserId ? userId : skipToken,
    );

    if (!isValidUserId) {
        return <PageCard>Некоректний id користувача.</PageCard>;
    }

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError || !data) {
        return <PageCard>Не вдалося завантажити користувача.</PageCard>;
    }

    return <EditUserPage user={data} />;
}
