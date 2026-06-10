import type { DateRangeValue } from "~/components/ui/date-picker";
import type { AnimeStatus } from "~/lib/constants/anime-status";
import type { AnimeType } from "~/lib/constants/anime-type";
import type { AnimeBase } from "~/lib/types/entities/anime-type";
import type { Image } from "~/lib/types/entities/image-type";

export type ScreenshotType = Image | {id: string; img: string};

export interface AnimeFormType {
    title: string;
    originalTitle?: string;
    engTitle?: string;

    description?: string;
    
    type: AnimeType;
    episodesTotal?: number;
    seasonNumber?: number;
    partNumber?: number;
    
    releaseDate?: DateRangeValue;
    
    genres?: string[];
    
    country?: string;
    duration?: number;
    studio?: string;

    mal?: string;
    al?: string;

    status: AnimeStatus;

    poster?: Image | string;

    screenshots?: ScreenshotType[];

    relation?: {
        type: "ANIME" | "RELATION";
        id: number;
        items: AnimeBase[];
    }
}