import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "~/lib/constants/api";

export const animiApi = createApi({
    reducerPath: "animiApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL + "/api",
        credentials: "include",
    }),
    tagTypes: [
        "Me",
        "User",
        "ReleaseTeam",
        "Player",
        "Genre",
        "Image",
        "Anime",
    ],
    endpoints: () => ({}),
});
