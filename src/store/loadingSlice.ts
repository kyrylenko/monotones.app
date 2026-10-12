import { createSlice } from '@reduxjs/toolkit';

export interface LoadingState {
    isCaching: boolean;
}

const initialState: LoadingState = { isCaching: false };

// Service worker caching progress (dispatched from src/index.tsx, not displayed yet)
const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        cachingStart(state) {
            state.isCaching = true;
        },
        cachingEnd(state) {
            state.isCaching = false;
        },
    },
});

export const loadingActions = loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;
