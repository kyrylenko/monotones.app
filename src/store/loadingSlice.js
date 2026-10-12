import { createSlice } from '@reduxjs/toolkit';

// Service worker caching progress (dispatched from src/index.jsx, not displayed yet)
const loadingSlice = createSlice({
    name: 'loading',
    initialState: { isCaching: false },
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
