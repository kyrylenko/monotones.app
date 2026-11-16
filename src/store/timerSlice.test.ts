import { configureStore } from '@reduxjs/toolkit';
import { timerReducer as reducer, timerActions as actions, type TimerState } from './timerSlice';
import { loadingReducer } from './loadingSlice';
import { timerTick } from './thunks';
import { mainReducer } from './mainSlice';

const NOW = 1_700_000_000_000;

describe('timerSlice', () => {
    it('returns the initial state', () => {
        expect(reducer(undefined, { type: '@@INIT' })).toEqual({ timerRun: false, interval: 1, endsAt: null });
    });

    it('timerStart sets the seconds and the end time, and runs while the time is positive', () => {
        expect(reducer(undefined, actions.timerStart(300, NOW))).toEqual({ timerRun: true, interval: 300, endsAt: NOW + 300_000 });
        expect(reducer(undefined, actions.timerStart(0, NOW))).toEqual({ timerRun: false, interval: 0, endsAt: null });
    });

    it('timerLeft counts down and keeps the end time', () => {
        const running = reducer(undefined, actions.timerStart(300, NOW));
        expect(reducer(running, actions.timerLeft(42))).toEqual({ timerRun: true, interval: 42, endsAt: NOW + 300_000 });
    });

    it('timerStop stops the timer and keeps the seconds', () => {
        const running: TimerState = { timerRun: true, interval: 42, endsAt: NOW };
        expect(reducer(running, actions.timerStop())).toEqual({ timerRun: false, interval: 42, endsAt: null });
    });
});

describe('timerTick', () => {
    const createStore = (timer: TimerState) => configureStore({
        reducer: { main: mainReducer, timer: reducer, loading: loadingReducer },
        preloadedState: { main: { isGlobalPlay: true, sounds: {}, mixtures: [], activeStarterMix: null, sharedMixName: null }, timer },
    });

    it('counts down from the end time', () => {
        const store = createStore({ timerRun: true, interval: 10, endsAt: NOW + 10_000 });
        store.dispatch(timerTick(NOW + 1_000));

        expect(store.getState().timer).toEqual({ timerRun: true, interval: 9, endsAt: NOW + 10_000 });
        expect(store.getState().main.isGlobalPlay).toBe(true);
    });

    it('catches up at once after the page was paused (screen locked), and stops when the time is up', () => {
        const store = createStore({ timerRun: true, interval: 600, endsAt: NOW + 600_000 });
        store.dispatch(timerTick(NOW + 3_600_000));

        expect(store.getState().timer).toEqual({ timerRun: false, interval: 0, endsAt: null });
        expect(store.getState().main.isGlobalPlay).toBe(false);
    });

    it('does nothing when the timer is not running', () => {
        const store = createStore({ timerRun: false, interval: 10, endsAt: null });
        store.dispatch(timerTick(NOW));

        expect(store.getState().timer).toEqual({ timerRun: false, interval: 10, endsAt: null });
    });
});
