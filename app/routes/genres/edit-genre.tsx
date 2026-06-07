import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router";
import EditGenresPage from "~/components/pages/genres/edit-genres-page";
import Loader from "~/components/ui/loader";
import PageCard from "~/components/ui/page-card";
import { useGetOneGenreQuery } from "~/lib/store/animi/genres.endpoints";

export default function EditGenre() {
    const { id } = useParams();
    const genreId = id ? Number(id) : Number.NaN;
    const isValidGenreId = Number.isFinite(genreId);

    const { data, isLoading, isFetching, isError } = useGetOneGenreQuery(
        isValidGenreId ? genreId : skipToken,
    );

    if (!isValidGenreId) {
        return <PageCard>Некоректний id жанру.</PageCard>;
    }

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (isError || !data) {
        return <PageCard>Не вдалося завантажити жанр.</PageCard>;
    }

    return <EditGenresPage genre={data} />;
}
