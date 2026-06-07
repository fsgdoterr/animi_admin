import type { Image } from "~/lib/types/entities/image-type";

export interface GenreFormType {
    title: string;
    poster?: Image | string | null;
}
