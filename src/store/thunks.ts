import { mainActions } from './mainSlice';
import { timerActions } from './timerSlice';
import { selectIsGlobalPlay } from './selectors';
import type { AppThunk } from './index';

// Counts the sleep timer down from its end time; pauses all sounds when the time is up
export const timerTick = (now: number = Date.now()): AppThunk => (dispatch, getState) => {
    const { timerRun, endsAt } = getState().timer;
    if (!timerRun || endsAt === null) {
        return;
    }

    const secondsLeft = Math.max(0, Math.ceil((endsAt - now) / 1000));
    dispatch(timerActions.timerLeft(secondsLeft));
    if (secondsLeft <= 0) {
        dispatch(timerActions.timerStop());
        dispatch(mainActions.globalPlayPause(false));
    }
};

// Global play/pause button: pausing also cancels the sleep timer
export const setGlobalPlay = (isPlay: boolean): AppThunk => (dispatch) => {
    dispatch(mainActions.globalPlayPause(isPlay));
    if (!isPlay) {
        dispatch(timerActions.timerStop());
    }
};

// Space key shortcut: toggles playback, keeps the sleep timer
export const toggleGlobalPlay = (): AppThunk => (dispatch, getState) => {
    dispatch(mainActions.globalPlayPause(!selectIsGlobalPlay(getState())));
};
