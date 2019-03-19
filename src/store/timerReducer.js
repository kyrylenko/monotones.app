export const TIMER_START = 'TIMER_START';
export const TIMER_STOP = 'TIMER_STOP';

export const actionCreators = {
    timerStart: (interval) => ({ type: TIMER_START, interval }),
    timerStop: () => ({ type: TIMER_STOP })
};

const timerState = {
    timerRun: false,
    interval: 1
};

export const timerReducer = (state, action) => {
    state = state || timerState;

    if (action.type === TIMER_START) {
        return { ...state, timerRun: action.interval > 0, interval: action.interval }
    }

    if (action.type === TIMER_STOP) {
        return { ...state, timerRun: false }
    }

    return state;
};