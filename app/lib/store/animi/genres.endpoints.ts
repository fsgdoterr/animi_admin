import { animiApi } from "~/lib/store/api/animi.api";
import type { Genre } from "~/lib/types/entities/genre-type";
import { getTotalCountFromHeaders } from "~/lib/utils/get-total-count-from-headers";

export interface GetAllGenresRequest {
    page: number;
    limit: number;
    search?: string;
}

export interface GetAllGenresResponse {
    items: Genre[];
    totalCount: number;
}

interface CreateGenreRequest {
    title: string;
    poster?: number | string | null;
}

interface UpdateGenreRequest {
    id: number;
    body: Partial<CreateGenreRequest>;
}

const animiGenresEndpoints = animiApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllGenres: builder.query<GetAllGenresResponse, GetAllGenresRequest>({
            query: ({ page, limit, search }) => ({
                url: "/genre",
                params: {
                    page,
                    limit,
                    ...(search ? { search } : {}),
                },
            }),
            transformResponse: (response: Genre[], meta) => ({
                items: Array.isArray(response) ? response : [],
                totalCount: getTotalCountFromHeaders(meta),
            }),
            providesTags: (result) => [
                { type: "Genre", id: "LIST" },
                ...(result?.items.map((genre) => ({
                    type: "Genre" as const,
                    id: genre.id,
                })) ?? []),
            ],
        }),
        createGenre: builder.mutation<Genre, CreateGenreRequest>({
            query: (body) => ({
                url: "/genre",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Genre", id: "LIST" }],
        }),
        getOneGenre: builder.query<Genre, number>({
            query: (genreId) => `/genre/${genreId}`,
            providesTags: (_result, _error, genreId) => [
                { type: "Genre", id: genreId },
            ],
        }),
        updateGenre: builder.mutation<Genre, UpdateGenreRequest>({
            query: ({ id, body }) => ({
                url: `/genre/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Genre", id },
                { type: "Genre", id: "LIST" },
            ],
        }),
        deleteGenre: builder.mutation<void, number>({
            query: (genreId) => ({
                url: `/genre/${genreId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, genreId) => [
                { type: "Genre", id: genreId },
                { type: "Genre", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllGenresQuery,
    useCreateGenreMutation,
    useGetOneGenreQuery,
    useUpdateGenreMutation,
    useDeleteGenreMutation
} = animiGenresEndpoints;
