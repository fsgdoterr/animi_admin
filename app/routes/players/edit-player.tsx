import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router";
import EditPlayerPage from "~/components/pages/players/edit-players-page";
import Loader from "~/components/ui/loader";
import PageCard from "~/components/ui/page-card";
import { useGetOnePlayerQuery } from "~/lib/store/animi/players.endpoints";

export default function EditPlayer() {
    const { id } = useParams();
    const playerId = id ? Number(id) : Number.NaN;
    const isValidPlayerId = Number.isFinite(playerId);

    const { data, isLoading, isFetching, isError } = useGetOnePlayerQuery(
        isValidPlayerId ? playerId : skipToken,
    );

    if (!isValidPlayerId) {
        return <PageCard>Некоректний id плеєра.</PageCard>;
    }

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError || !data) {
        return <PageCard>Не вдалося завантажити плеєр.</PageCard>;
    }

    return <EditPlayerPage player={data} />;
}
