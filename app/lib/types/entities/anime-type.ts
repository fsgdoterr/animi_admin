import type { AnimeStatus } from "~/lib/constants/anime-status";
import type { AnimeType } from "~/lib/constants/anime-type";
import type { Genre } from "~/lib/types/entities/genre-type";
import type { Image } from "~/lib/types/entities/image-type";

export interface AnimeBase {
    id: number;
    title: string;
    slug: string;
    originalTitle: string | null;
    engTitle: string | null;
    description: string | null;
    type: AnimeType;
    status: AnimeStatus;
    episodesTotal: number | null;
    seasonNumber: number | null;
    partNumber: number | null;
    releaseDate: string | null;
    endDate: string | null;
    country: string | null;
    duration: number | null;
    studio: string | null;
    poster: Image | null;
    genres: Genre[];
    mal: string;
    al: string;
    createdAt: string;
    updatedAt: string;
}

export interface Relation {
    id: number;
    items: AnimeBase;
}

export interface AnimeFull extends AnimeBase {
    screenshots: Image[];
    relations: Relation;
}