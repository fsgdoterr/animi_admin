import type { AnimeStatus } from "~/lib/constants/anime-status";
import type { AnimeType } from "~/lib/constants/anime-type";
import { animiApi } from "~/lib/store/api/animi.api";
import type { AnimeBase, AnimeFull } from "~/lib/types/entities/anime-type";
import { getTotalCountFromHeaders } from "~/lib/utils/get-total-count-from-headers";

export interface GetAllAnimesRequest {
    page: number;
    limit: number;
    search?: string;
}

export interface GetAllAnimesResponse {
    items: AnimeBase[];
    totalCount: number;
}

export interface CreateAnimeRequest {
    title: string;
    originalTitle?: string;
    engTitle?: string;
    description?: string;
    type?: AnimeType;
    status?: AnimeStatus;
    episodesTotal?: number;
    seasonNumber?: number;
    partNumber?: number;
    releaseDate?: string;
    endDate?: string;
    country?: string;
    duration?: number;
    studio?: string;
    mal?: string
    al?: string;
    poster?: number | string;
    screenshots?: (number | string)[];
    genres?: string[];
    relation?: {
        type: "ANIME" | "RELATION";
        id: number;
    };
}

export interface UpdateAnimeRequest {
    id: number;
    body: Partial<CreateAnimeRequest>;
}

const animiAnimesEndpoints = animiApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAnimes: builder.query<GetAllAnimesResponse, GetAllAnimesRequest>({
            query: ({ page, limit, search }) => ({
                url: "/anime",
                params: {
                    page,
                    limit,
                    ...(search ? { search } : {}),
                },
            }),
            transformResponse: (response: AnimeBase[], meta) => ({
                items: Array.isArray(response) ? response : [],
                totalCount: getTotalCountFromHeaders(meta),
            }),
            providesTags: (result) => [
                { type: "Anime", id: "LIST" },
                ...(result?.items.map((anime) => ({
                    type: "Anime" as const,
                    id: anime.id,
                })) ?? []),
            ],
        }),
        createAnime: builder.mutation<AnimeFull, CreateAnimeRequest>({
            query: (body) => ({
                url: "/anime",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Anime", id: "LIST" }],
        }),
        getOneAnime: builder.query<AnimeFull, number>({
            query: (animeId) => `/anime/${animeId}`,
            providesTags: (_result, _error, animeId) => [
                { type: "Anime", id: animeId },
            ],
        }),
        updateAnime: builder.mutation<AnimeFull, UpdateAnimeRequest>({
            query: ({ id, body }) => ({
                url: `/anime/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Anime", id },
                { type: "Anime", id: "LIST" },
            ],
        }),
        deleteAnime: builder.mutation<void, number>({
            query: (animeId) => ({
                url: `/anime/${animeId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, animeId) => [
                { type: "Anime", id: animeId },
                { type: "Anime", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllAnimesQuery,
    useCreateAnimeMutation,
    useGetOneAnimeQuery,
    useUpdateAnimeMutation,
    useDeleteAnimeMutation,
} = animiAnimesEndpoints;
