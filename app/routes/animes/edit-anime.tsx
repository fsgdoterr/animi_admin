import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router";
import EditAnimePage from "~/components/pages/animes/edit-anime-page";
import Loader from "~/components/ui/loader";
import PageCard from "~/components/ui/page-card";
import { useGetOneAnimeQuery } from "~/lib/store/animi/animes.endpoints";

export default function EditAnime() {
    const { id } = useParams();
    const animeId = id ? Number(id) : Number.NaN;
    const isValidAnimeId = Number.isFinite(animeId);

    const { data, isLoading, isFetching, isError } = useGetOneAnimeQuery(
        isValidAnimeId ? animeId : skipToken,
    );

    if (!isValidAnimeId) {
        return <PageCard>Некоректний id аніме.</PageCard>;
    }

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError || !data) {
        return <PageCard>Не вдалося завантажити аніме.</PageCard>;
    }

    return <EditAnimePage anime={data} />;
}
