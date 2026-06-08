import {
    FormProvider,
    useForm,
    type SubmitErrorHandler,
    type SubmitHandler,
} from "react-hook-form";
import AdditionalBlock from "~/components/pages/animes/anime-form/additional-block";
import DatesBlock from "~/components/pages/animes/anime-form/dates-block";
import DescriptionBlock from "~/components/pages/animes/anime-form/description-block";
import GenresBlock from "~/components/pages/animes/anime-form/genres-block";
import LinksBlock from "~/components/pages/animes/anime-form/links-block";
import PosterBlock from "~/components/pages/animes/anime-form/poster-block";
import RelationBlock from "~/components/pages/animes/anime-form/relation-block";
import ScreenshotsBlock from "~/components/pages/animes/anime-form/screenshots-block";
import StatusBlock from "~/components/pages/animes/anime-form/status-block";
import TitlesBlock from "~/components/pages/animes/anime-form/titles-block";
import TypesBlock from "~/components/pages/animes/anime-form/types-block";
import PageCard from "~/components/ui/page-card";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";
import { showFormErrorsToast } from "~/lib/utils/form-errors";

interface Props {
    submit: SubmitHandler<AnimeFormType>;
    formId?: string;
    defaultValues?: Partial<AnimeFormType>;
    showResetButtons?: boolean;
    isEdit?: boolean;
}

export default function AnimeForm({
    submit,
    formId,
    defaultValues,
    showResetButtons = false,
    isEdit = false,
}: Props) {
    const methods = useForm<AnimeFormType>({
        defaultValues: {
            title: "",
            ...defaultValues,
        },
    });

    const invalidSubmitHandler: SubmitErrorHandler<AnimeFormType> = (
        formErrors,
    ) => showFormErrorsToast(formErrors);

    return (
        <FormProvider {...methods}>
            <form
                className="
                    w-full
                    grid griod-cols-1 gap-5
                    xl:grid-cols-[minmax(0,1fr)_300px]
                "
                onSubmit={methods.handleSubmit(submit, invalidSubmitHandler)}
                id={formId}
            >
                <PageCard className="order-2 xl:order-none xl:col-start-1 xl:row-start-1 xl:row-span-4 flex flex-col gap-5">
                    <TitlesBlock />
                    <DescriptionBlock />
                    <TypesBlock />
                    <DatesBlock />
                    <GenresBlock />
                    <AdditionalBlock />
                    <LinksBlock />
                    <RelationBlock />
                </PageCard>
                <PageCard className="order-1 xl:order-none xl:col-start-2 xl:row-start-1">
                    <StatusBlock />
                </PageCard>
                <PageCard className="order-3 xl:order-none xl:col-start-2 xl:row-start-2">
                    <PosterBlock />
                </PageCard>
                <PageCard className="order-4 xl:order-none xl:col-start-2 xl:row-start-3">
                    <ScreenshotsBlock />
                </PageCard>
            </form>
        </FormProvider>
    );
}
