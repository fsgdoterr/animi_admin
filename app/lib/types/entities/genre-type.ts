import type { Image } from "~/lib/types/entities/image-type";

export interface Genre  {
    id: number;
    title: string;
    slug: string;
    poster: Image | null;

    createdAt: string;
    updatedAt: string;
}