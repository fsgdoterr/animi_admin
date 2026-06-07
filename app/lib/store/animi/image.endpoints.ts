import { animiApi } from "~/lib/store/api/animi.api";
import type { Image } from "~/lib/types/entities/image-type";
import { getTotalCountFromHeaders } from "~/lib/utils/get-total-count-from-headers";

export interface GetAllImagesRequest {
    page: number;
    limit: number;
    search?: string;
}

export interface GetAllImagesResponse {
    items: Image[];
    totalCount: number;
}



const animiGenresEndpoints = animiApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllImages: builder.query<GetAllImagesResponse, GetAllImagesRequest>({
            query: ({ page, limit, search }) => ({
                url: "/image",
                params: {
                    page,
                    limit,
                    ...(search ? { search } : {}),
                },
            }),
            transformResponse: (response: Image[], meta) => ({
                items: Array.isArray(response) ? response : [],
                totalCount: getTotalCountFromHeaders(meta),
            }),
            providesTags: (result) => [
                { type: "Image", id: "LIST" },
                ...(result?.items.map((image) => ({
                    type: "Image" as const,
                    id: image.id,
                })) ?? []),
            ],
        }),
    }),
});

export const {
    useGetAllImagesQuery,
} = animiGenresEndpoints;
