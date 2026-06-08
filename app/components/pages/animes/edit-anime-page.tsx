import { useId, useMemo, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import AnimeForm from "~/components/pages/animes/anime-form/anime-form";
import Button from "~/components/ui/buttons/button";
import TabButton from "~/components/ui/buttons/tab-button";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import {
    useUpdateAnimeMutation,
    type CreateAnimeRequest,
} from "~/lib/store/animi/animes.endpoints";
import type { AnimeFull } from "~/lib/types/entities/anime-type";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

export default function EditAnimePage({ anime }: { anime: AnimeFull }) {
    const formId = useId();
    const navigate = useNavigate();
    const [updateAnime, { isLoading }] = useUpdateAnimeMutation();

    const defaultValues = useMemo<Partial<AnimeFormType>>(
        () => ({
            title: anime.title,
            originalTitle: anime.originalTitle || undefined,
            engTitle: anime.engTitle || undefined,
            description: anime.description || undefined,
            type: anime.type || undefined,
            episodesTotal: anime.episodesTotal || undefined,
            seasonNumber: anime.seasonNumber || undefined,
            partNumber: anime.partNumber || undefined,
            releaseDate: {
                from: anime.releaseDate,
                to: anime.endDate,
            },
            genres: anime.genres.map((g) => g.title),
            country: anime.country || undefined,
            duration: anime.duration || undefined,
            studio: anime.studio || undefined,
            mal: anime.mal || undefined,
            al: anime.al || undefined,
            status: anime.status || undefined,
            poster: anime.poster || undefined,
            screenshots: anime.screenshots,
            // relation?: {
            //     type: "ANIME" | "RELATION";
            //     id: number;
            // }
        }),
        [anime],
    );

    const submit: SubmitHandler<AnimeFormType> = async (data) => {
        try {
            const obj = {
                title: data.title,
                originalTitle: data.originalTitle || undefined,
                engTitle: data.engTitle || undefined,
                description: data.description || undefined,
                type: data.type || undefined,
                status: data.status || undefined,
                episodesTotal: data.episodesTotal || undefined,
                seasonNumber: data.seasonNumber || undefined,
                partNumber: data.partNumber || undefined,
                releaseDate: data.releaseDate?.from || undefined,
                endDate: data.releaseDate?.to || undefined,
                country: data.country || undefined,
                duration: data.duration || undefined,
                studio: data.studio || undefined,
                mal: data.mal || undefined,
                al: data.al || undefined,
                poster:
                    typeof data.poster === "string"
                        ? data.poster
                        : data.poster?.id,
                genres: data.genres,
                screenshots: data.screenshots?.map((scr) =>
                    "img" in scr ? scr.img : scr.id,
                ),
                // relation
            } satisfies Partial<CreateAnimeRequest>;
            await updateAnime({
                id: anime.id,
                body: obj,
            }).unwrap();

            toast.success("Аніме оновлено.");
            navigate("/animes");
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Не вдалося оновити аніме."));
        }
    };

    const [tab, setTab] = useState<"main" | "episodes">("main");

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                backUrl="/animes"
                title="Редагування аніме"
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
                #{anime.id} - {anime.title}
            </div>
            <div className="flex gap-2.5">
                <TabButton
                    text="Основна інформація"
                    isActive={tab === "main"}
                    onClicked={() => setTab("main")}
                />
                <TabButton
                    text="Серії"
                    isActive={tab === "episodes"}
                    onClicked={() => setTab("episodes")}
                />
            </div>
            {tab === "main" && (
                <AnimeForm
                    formId={formId}
                    submit={submit}
                    defaultValues={defaultValues}
                    showResetButtons
                    isEdit
                />
            )}
            {tab === "episodes" && <></>}
        </div>
    );
}
