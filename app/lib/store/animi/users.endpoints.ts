import { animiApi } from "~/lib/store/api/animi.api";
import type { Permissions } from "~/lib/constants/permissions";
import type { User } from "~/lib/types/entities/user-type";
import { getTotalCountFromHeaders } from "~/lib/utils/get-total-count-from-headers";

export interface GetAllUsersRequest {
    page: number;
    limit: number;
    search?: string;
}

export interface GetAllUsersResponse {
    items: User[];
    totalCount: number;
}

interface CreateUserRequest {
    email: string;
    username: string;
    password: string;
    displayName?: string;
    avatarId?: number;
    permissions?: Permissions[];
}

interface UpdateUserRequest {
    id: number;
    body: Partial<CreateUserRequest>;
}

const animiUsersEndpoints = animiApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query<GetAllUsersResponse, GetAllUsersRequest>({
            query: ({ page, limit, search }) => ({
                url: "/user",
                params: {
                    page,
                    limit,
                    ...(search ? { search } : {}),
                },
            }),
            transformResponse: (response: User[], meta) => ({
                items: Array.isArray(response) ? response : [],
                totalCount: getTotalCountFromHeaders(meta),
            }),
            providesTags: (result) => [
                { type: "User", id: "LIST" },
                ...(result?.items.map((user) => ({
                    type: "User" as const,
                    id: user.id,
                })) ?? []),
            ],
        }),
        createUser: builder.mutation<User, CreateUserRequest>({
            query: (body) => ({
                url: "/user",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "User", id: "LIST" }],
        }),
        getOneUser: builder.query<User, number>({
            query: (userId) => `/user/${userId}`,
            providesTags: (_result, _error, userId) => [
                { type: "User", id: userId },
            ],
        }),
        updateUser: builder.mutation<User, UpdateUserRequest>({
            query: ({ id, body }) => ({
                url: `/user/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "User", id },
                { type: "User", id: "LIST" },
            ],
        }),
        deleteUser: builder.mutation<void, number>({
            query: (userId) => ({
                url: `/user/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, userId) => [
                { type: "User", id: userId },
                { type: "User", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useCreateUserMutation,
    useGetOneUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = animiUsersEndpoints;
