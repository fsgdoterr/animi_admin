import { configureStore } from "@reduxjs/toolkit";
import { animiApi } from "~/lib/store/api/animi.api";
import animePageReducer from "~/lib/store/slices/anime-page.slice";

export const store = configureStore({
    reducer: {
        animePage: animePageReducer,
        [animiApi.reducerPath]: animiApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(animiApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
