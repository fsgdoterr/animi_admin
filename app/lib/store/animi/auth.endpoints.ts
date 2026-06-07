import { animiApi } from "~/lib/store/api/animi.api";
import type { User } from "~/lib/types/entities/user-type";

interface SigninRequest {
    usernameOrEmail: string;
    password: string;
}

const animiAuthEndpoints = animiApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => "/auth/me",
            providesTags: ["Me"],
        }),
        signin: builder.mutation<User, SigninRequest>({
            query: (body) => ({
                url: "/auth/signin",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Me"],
        }),
        logout: builder.query<void, void>({
            query: () => "/auth/logout",
            providesTags: ["Me"],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(animiApi.util.resetApiState());
                } catch {}
            },
        }),
    }),
});

export const { useGetMeQuery, useSigninMutation, useLazyLogoutQuery } =
    animiAuthEndpoints;
