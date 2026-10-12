import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    timerRun: false,
    interval: 1, // seconds left
};

const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        timerStart(state, { payload: interval }) {
            state.timerRun = interval > 0;
            state.interval = interval;
        },
        timerStop(state) {
            state.timerRun = false;
        },
    },
});

export const timerActions = timerSlice.actions;
export const timerReducer = timerSlice.reducer;

