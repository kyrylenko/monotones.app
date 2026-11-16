import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TimerState {
    timerRun: boolean;
    /** Seconds left, as last counted */
    interval: number;
    /** When the timer ends (ms since 1970). The countdown follows the clock, so it is right after the page was paused
     *  (iOS pauses the page's timers while the screen is locked) */
    endsAt: number | null;
}

const initialState: TimerState = {
    timerRun: false,
    interval: 1,
    endsAt: null,
};

const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        timerStart: {
            reducer(state, { payload: { seconds, endsAt } }: PayloadAction<{ seconds: number; endsAt: number }>) {
                state.timerRun = seconds > 0;
                state.interval = seconds;
                state.endsAt = seconds > 0 ? endsAt : null;
            },
            prepare: (seconds: number, now: number = Date.now()) => ({ payload: { seconds, endsAt: now + seconds * 1000 } }),
        },
        // A tick of the countdown: the seconds left, the end time stays
        timerLeft(state, { payload: seconds }: PayloadAction<number>) {
            state.interval = seconds;
        },
        timerStop(state) {
            state.timerRun = false;
            state.endsAt = null;
        },
    },
});

export const timerActions = timerSlice.actions;
export const timerReducer = timerSlice.reducer;
