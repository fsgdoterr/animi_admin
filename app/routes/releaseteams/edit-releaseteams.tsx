import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router";
import EditReleaseTeamsPage from "~/components/pages/releaseteams/edit-releaseteams-page";
import Loader from "~/components/ui/loader";
import PageCard from "~/components/ui/page-card";
import { useGetOneReleaseTeamQuery } from "~/lib/store/animi/releaseteams.endpoints";

export default function EditReleaseTeams() {
    const { id } = useParams();
    const playerId = id ? Number(id) : Number.NaN;
    const isValidReleaseTeamId = Number.isFinite(playerId);

    const { data, isLoading, isFetching, isError } = useGetOneReleaseTeamQuery(
        isValidReleaseTeamId ? playerId : skipToken,
    );

    if (!isValidReleaseTeamId) {
        return <PageCard>Некоректний id команди озвучення.</PageCard>;
    }

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError || !data) {
        return <PageCard>Не вдалося завантажити команду озвучення.</PageCard>;
    }

    return <EditReleaseTeamsPage releaseTeam={data} />;
}
