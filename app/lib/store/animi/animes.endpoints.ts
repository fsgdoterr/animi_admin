import type { AnimeStatus } from "~/lib/constants/anime-status";
import type { AnimeType } from "~/lib/constants/anime-type";
import { animiApi } from "~/lib/store/api/animi.api";
import type { AnimeBase, AnimeFull } from "~/lib/types/entities/anime-type";
import type {
    CursorPaginationRequest,
    PagePaginationRequest,
} from "~/lib/types/pagination";
import { getNextCursorFromHeaders } from "~/lib/utils/get-next-cursor-from-headers";
import { getTotalCountFromHeaders } from "~/lib/utils/get-total-count-from-headers";

export interface GetAllAnimesResponse {
    items: AnimeBase[];
    totalCount: number;
    nextCursor?: number;
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
    mal?: string;
    al?: string;
    poster?: number | string;
    screenshots?: (number | string)[];
    genres?: string[];
    relation?: {
        type: "ANIME" | "RELATION";
        id: number;
    } | null;
}

export interface UpdateAnimeRequest {
    id: number;
    body: Partial<CreateAnimeRequest>;
}

const animiAnimesEndpoints = animiApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAnimeCursor: builder.query<
            GetAllAnimesResponse,
            CursorPaginationRequest
        >({
            query: ({ search, limit, cursor }) => ({
                url: "/anime",
                params: {
                    cursor,
                    limit,
                    ...(search ? { search } : {}),
                },
            }),
            transformResponse: (response: AnimeBase[], meta) => ({
                items: Array.isArray(response) ? response : [],
                totalCount: getTotalCountFromHeaders(meta),
                nextCursor: getNextCursorFromHeaders(meta),
            }),
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs.search ?? ""}-${queryArgs.limit}`;
            },
            merge: (currentCache, newCache, { arg }) => {
                currentCache.totalCount = newCache.totalCount;
                currentCache.nextCursor = newCache.nextCursor;

                if (arg.cursor == null) {
                    currentCache.items = newCache.items;
                    return;
                }

                const existingIds = new Set(
                    currentCache.items.map((anime) => anime.id),
                );

                for (const anime of newCache.items) {
                    if (!existingIds.has(anime.id)) {
                        currentCache.items.push(anime);
                    }
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return (
                    currentArg?.cursor !== previousArg?.cursor ||
                    currentArg?.search !== previousArg?.search ||
                    currentArg?.limit !== previousArg?.limit
                );
            },
            providesTags: (result) => [
                { type: "Anime", id: "LIST" },
                ...(result?.items.map((anime) => ({
                    type: "Anime" as const,
                    id: anime.id,
                })) ?? []),
            ],
        }),
        getAllAnimes: builder.query<
            GetAllAnimesResponse,
            PagePaginationRequest
        >({
            query: ({ search, limit, page }) => ({
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
    useGetAllAnimeCursorQuery,
    useGetAllAnimesQuery,
    useCreateAnimeMutation,
    useGetOneAnimeQuery,
    useLazyGetOneAnimeQuery,
    useUpdateAnimeMutation,
    useDeleteAnimeMutation,
} = animiAnimesEndpoints;
