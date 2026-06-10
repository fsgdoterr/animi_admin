import { Calendar, Clock, Film } from "lucide-react";
import { API_URL } from "~/lib/constants/api";
import type { AnimeBase } from "~/lib/types/entities/anime-type";

interface Props {
    anime: AnimeBase;
}

export default function RelationItem({ anime }: Props) {
    const releaseYear = anime.releaseDate
        ? new Date(anime.releaseDate).getFullYear()
        : null;

    return (
        <div className="group flex gap-3 rounded-xl bg-(--bg-2) p-2 ring-1 ring-(--bg-4) transition hover:bg-(--bg-3) hover:ring-(--primary)">
            <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-lg bg-(--grey-2)">
                {anime.poster ? (
                    <img
                        src={API_URL + "/uploads/" + anime.poster.path}
                        alt={anime.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-(--grey-1)">
                        Немає
                    </div>
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <div className="line-clamp-2 text-sm font-medium leading-snug text-(--text)">
                                {anime.title}
                            </div>

                            {(anime.engTitle || anime.originalTitle) && (
                                <div className="mt-0.5 truncate text-xs text-(--grey-2)">
                                    {anime.engTitle || anime.originalTitle}
                                </div>
                            )}
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1">
                            <span className="rounded-md bg-(--bg-4) px-1.5 py-0.5 text-[10px] font-medium text-(--grey-2)">
                                {anime.type}
                            </span>

                            <span className="rounded-md bg-(--bg-4) px-1.5 py-0.5 text-[10px] font-medium text-(--grey-2)">
                                {anime.status}
                            </span>
                        </div>
                    </div>

                    {anime.genres?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {anime.genres.slice(0, 3).map((genre) => (
                                <span
                                    key={genre.id}
                                    className="rounded-full bg-(--bg-4) px-2 py-0.5 text-[10px] text-(--grey-2)"
                                >
                                    {genre.title}
                                </span>
                            ))}

                            {anime.genres.length > 3 && (
                                <span className="rounded-full bg-(--bg-4) px-2 py-0.5 text-[10px] text-(--grey-2)">
                                    +{anime.genres.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                    {releaseYear && (
                        <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{releaseYear}</span>
                        </div>
                    )}

                    {anime.episodesTotal && (
                        <div className="flex items-center gap-1">
                            <Film size={12} />
                            <span>{anime.episodesTotal} еп.</span>
                        </div>
                    )}

                    {anime.duration && (
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{anime.duration} хв.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
