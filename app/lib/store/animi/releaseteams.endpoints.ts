import { animiApi } from "~/lib/store/api/animi.api";
import type { ReleaseTeam } from "~/lib/types/entities/release-team-type";

export interface GetAllReleaseTeamsRequest {
    page: number;
    limit: number;
    search?: string;
}

export interface GetAllReleaseTeamsResponse {
    items: ReleaseTeam[];
    totalCount: number;
}

interface CreateReleaseTeamRequest {
    title: string;
}

interface UpdateReleaseTeamRequest {
    id: number;
    body: Partial<CreateReleaseTeamRequest>;
}

function getTotalCountFromHeaders(meta: unknown) {
    const response = (meta as { response?: Response } | undefined)?.response;
    const totalCountHeader = response?.headers.get("X-Total-Count");
    const totalCount = Number(totalCountHeader ?? 0);

    return Number.isFinite(totalCount) ? totalCount : 0;
}

const animiReleaseteamsEndpoints = animiApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllReleaseTeams: builder.query<GetAllReleaseTeamsResponse, GetAllReleaseTeamsRequest>({
            query: ({ page, limit, search }) => ({
                url: "/release-team",
                params: {
                    page,
                    limit,
                    ...(search ? { search } : {}),
                },
            }),
            transformResponse: (response: ReleaseTeam[], meta) => ({
                items: Array.isArray(response) ? response : [],
                totalCount: getTotalCountFromHeaders(meta),
            }),
            providesTags: (result) => [
                { type: "ReleaseTeam", id: "LIST" },
                ...(result?.items.map((releaseTeam) => ({
                    type: "ReleaseTeam" as const,
                    id: releaseTeam.id,
                })) ?? []),
            ],
        }),
        createReleaseTeam: builder.mutation<ReleaseTeam, CreateReleaseTeamRequest>({
            query: (body) => ({
                url: "/release-team",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "ReleaseTeam", id: "LIST" }],
        }),
        getOneReleaseTeam: builder.query<ReleaseTeam, number>({
            query: (releaseTeamId) => `/release-team/${releaseTeamId}`,
            providesTags: (_result, _error, releaseTeamId) => [
                { type: "ReleaseTeam", id: releaseTeamId },
            ],
        }),
        updateReleaseTeam: builder.mutation<ReleaseTeam, UpdateReleaseTeamRequest>({
            query: ({ id, body }) => ({
                url: `/release-team/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "ReleaseTeam", id },
                { type: "ReleaseTeam", id: "LIST" },
            ],
        }),
        deleteReleaseTeam: builder.mutation<void, number>({
            query: (releaseTeamId) => ({
                url: `/release-team/${releaseTeamId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, releaseTeamId) => [
                { type: "ReleaseTeam", id: releaseTeamId },
                { type: "ReleaseTeam", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllReleaseTeamsQuery,
    useCreateReleaseTeamMutation,
    useGetOneReleaseTeamQuery,
    useUpdateReleaseTeamMutation,
    useDeleteReleaseTeamMutation,
} = animiReleaseteamsEndpoints;
