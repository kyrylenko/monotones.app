import { mainActions } from './mainSlice';
import { timerActions } from './timerSlice';
import { selectIsGlobalPlay } from './selectors';
import type { AppThunk } from './index';

// One second of the sleep timer: pauses all sounds when the time is up
export const timerTick = (): AppThunk => (dispatch, getState) => {
    const { timerRun, interval } = getState().timer;
    if (!timerRun) {
        return;
    }

    dispatch(timerActions.timerStart(interval - 1));
    if (interval - 1 <= 0) {
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
