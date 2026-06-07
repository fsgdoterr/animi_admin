import { animiApi } from "~/lib/store/api/animi.api";
import type { Player } from "~/lib/types/entities/player-type";
import { getTotalCountFromHeaders } from "~/lib/utils/get-total-count-from-headers";

export interface GetAllPlayersRequest {
    page: number;
    limit: number;
    search?: string;
}

export interface GetAllPlayersResponse {
    items: Player[];
    totalCount: number;
}

interface CreatePlayerRequest {
    title: string;
}

interface UpdatePlayerRequest {
    id: number;
    body: Partial<CreatePlayerRequest>;
}

const animiPlayersEndpoints = animiApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPlayers: builder.query<GetAllPlayersResponse, GetAllPlayersRequest>({
            query: ({ page, limit, search }) => ({
                url: "/player",
                params: {
                    page,
                    limit,
                    ...(search ? { search } : {}),
                },
            }),
            transformResponse: (response: Player[], meta) => ({
                items: Array.isArray(response) ? response : [],
                totalCount: getTotalCountFromHeaders(meta),
            }),
            providesTags: (result) => [
                { type: "Player", id: "LIST" },
                ...(result?.items.map((player) => ({
                    type: "Player" as const,
                    id: player.id,
                })) ?? []),
            ],
        }),
        createPlayer: builder.mutation<Player, CreatePlayerRequest>({
            query: (body) => ({
                url: "/player",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Player", id: "LIST" }],
        }),
        getOnePlayer: builder.query<Player, number>({
            query: (playerId) => `/player/${playerId}`,
            providesTags: (_result, _error, playerId) => [
                { type: "Player", id: playerId },
            ],
        }),
        updatePlayer: builder.mutation<Player, UpdatePlayerRequest>({
            query: ({ id, body }) => ({
                url: `/player/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Player", id },
                { type: "Player", id: "LIST" },
            ],
        }),
        deletePlayer: builder.mutation<void, number>({
            query: (playerId) => ({
                url: `/player/${playerId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, playerId) => [
                { type: "Player", id: playerId },
                { type: "Player", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllPlayersQuery,
    useCreatePlayerMutation,
    useGetOnePlayerQuery,
    useUpdatePlayerMutation,
    useDeletePlayerMutation
} = animiPlayersEndpoints;
