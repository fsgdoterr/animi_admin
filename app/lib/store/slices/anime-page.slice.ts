import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    showResetButtons: boolean;
}

const initialState: InitialState = {
    showResetButtons: false,
};

export const animePageSlice = createSlice({
    name: "animePage",
    initialState,
    reducers: {
        setShowResetButtons(state, action: PayloadAction<boolean>) {
            state.showResetButtons = action.payload;
        },
    },
});

export const { setShowResetButtons } = animePageSlice.actions;

export default animePageSlice.reducer;
