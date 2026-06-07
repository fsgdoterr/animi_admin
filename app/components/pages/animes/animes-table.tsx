import AnimeStatusPlate from "~/components/ui/anime-status-plate";
import Table, { type TableColumn } from "~/components/ui/table";
import type { AnimeBase } from "~/lib/types/entities/anime-type";
import { beautifyNumber } from "~/lib/utils/beautify-numbers";
import {
    createActionsColumn,
    createCreatedAtColumn,
    createIdColumn,
    createTextColumn,
    createTitleWithPosterColumn,
    createUpdatedAtColumn,
} from "~/lib/utils/table-columns";

interface Props {
    animes: AnimeBase[];
    isLoading?: boolean;
    onDelete: (anime: AnimeBase) => void;
}

export default function AnimesTable({ animes, isLoading, onDelete }: Props) {
    const columns: TableColumn<AnimeBase>[] = [
        createIdColumn<AnimeBase>(),
        createTitleWithPosterColumn<AnimeBase>(),
        {
            id: "genres",
            header: "Жанри",
            width: "180px",
            render: (anime) => (
                <div className="uppercase cuprum-700 text-sm line-clamp-2">
                    {anime.genres.map((g) => g.title + " ")}
                </div>
            ),
        },
        createCreatedAtColumn<AnimeBase>("135px"),
        createUpdatedAtColumn<AnimeBase>("135px"),
        {
            id: "status",
            header: "Статус",
            width: "70px",
            render: (anime) => (
                <div className="">
                    <AnimeStatusPlate status={anime.status} />
                </div>
            ),
        },
        {
            id: "episodes",
            header: "Серії",
            width: "100px",
            align: "center",
            render: (anime) => (
                <div className="flex gap-0.5 items-center justify-center">
                    <span className=" text-(--grey-2)">12</span>
                    <span className="text-xs">/</span>
                    <span className=" text-(--primary)">9</span>
                    <span className="text-xs">/</span>
                    <span className=" text-(--green)">8</span>
                </div>
            ),
        },
        {
            id: "review",
            header: "Оцінка",
            width: "90px",
            align: "center",
            render: (anime) => <div className="text-(--yellow)">4.5/9890</div>,
        },
        createTextColumn<AnimeBase>({
            id: "views",
            header: "Перегляди",
            width: "90px",
            getValue: (anime) => beautifyNumber(895_876),
        }),
        createActionsColumn<AnimeBase>({
            editUrl: (anime) => `/animes/${anime.id}`,
            onDelete,
            width: "",
        }),
    ];

    return (
        <Table
            data={animes}
            getRowKey={(row) => row.id}
            columns={columns}
            isLoading={isLoading}
        />
    );
}
