import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TimerState {
    timerRun: boolean;
    /** Seconds left */
    interval: number;
}

const initialState: TimerState = {
    timerRun: false,
    interval: 1,
};

const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        timerStart(state, { payload: interval }: PayloadAction<number>) {
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
