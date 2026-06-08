import { useId, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import AnimeForm from "~/components/pages/animes/anime-form/anime-form";
import Button from "~/components/ui/buttons/button";
import TabButton from "~/components/ui/buttons/tab-button";
import PageCard from "~/components/ui/page-card";
import PageHeader from "~/components/ui/page-header";
import { useCreateAnimeMutation, type CreateAnimeRequest } from "~/lib/store/animi/animes.endpoints";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

export default function CreateAnimePage() {
    const [createAnime, { isLoading }] = useCreateAnimeMutation();
    const formId = useId();
    const navigate = useNavigate();

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
            } satisfies CreateAnimeRequest;
            console.log(obj);
            await createAnime(obj).unwrap();

            toast.success("Аніме створено.");
            navigate("/animes");
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, "Не вдалося створити аніме."),
            );
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <PageHeader
                backUrl="/animes"
                title="Створити аніме"
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
            <div className="flex gap-2.5">
                <TabButton text="Основна інформація" isActive={true} />
                <TabButton text="Серії" disabled={true} />
            </div>
            <AnimeForm formId={formId} submit={submit} />
        </div>
    );
}
