import { configureStore } from '@reduxjs/toolkit';
import { timerReducer as reducer, timerActions as actions, type TimerState } from './timerSlice';
import { loadingReducer } from './loadingSlice';
import { timerTick } from './thunks';
import { mainReducer } from './mainSlice';

describe('timerSlice', () => {
    it('returns the initial state', () => {
        expect(reducer(undefined, { type: '@@INIT' })).toEqual({ timerRun: false, interval: 1 });
    });

    it('timerStart sets the interval and runs while it is positive', () => {
        expect(reducer(undefined, actions.timerStart(300))).toEqual({ timerRun: true, interval: 300 });
        expect(reducer(undefined, actions.timerStart(0))).toEqual({ timerRun: false, interval: 0 });
    });

    it('timerStop stops the timer and keeps the interval', () => {
        expect(reducer({ timerRun: true, interval: 42 }, actions.timerStop())).toEqual({ timerRun: false, interval: 42 });
    });
});

describe('timerTick', () => {
    const createStore = (timer: TimerState) => configureStore({
        reducer: { main: mainReducer, timer: reducer, loading: loadingReducer },
        preloadedState: { main: { isGlobalPlay: true, sounds: {}, mixtures: [] }, timer },
    });

    it('counts one second down', () => {
        const store = createStore({ timerRun: true, interval: 10 });
        store.dispatch(timerTick());

        expect(store.getState().timer).toEqual({ timerRun: true, interval: 9 });
        expect(store.getState().main.isGlobalPlay).toBe(true);
    });

    it('stops the timer and pauses playback at zero', () => {
        const store = createStore({ timerRun: true, interval: 1 });
        store.dispatch(timerTick());

        expect(store.getState().timer).toEqual({ timerRun: false, interval: 0 });
        expect(store.getState().main.isGlobalPlay).toBe(false);
    });

    it('does nothing when the timer is not running', () => {
        const store = createStore({ timerRun: false, interval: 10 });
        store.dispatch(timerTick());

        expect(store.getState().timer).toEqual({ timerRun: false, interval: 10 });
    });
});
