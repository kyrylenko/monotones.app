import soundIds from '../constants/soundIds';

export const PLAY_PAUSE_VOLUME = 'PLAY_PAUSE_VOLUME';
export const PAUSE_SOUND = 'PAUSE_SOUND';

const initialState = {
    sounds: [
        { id: soundIds.sailing_yacht, isPlay: true, volume: 0.2 },
        { id: soundIds.summer_day, isPlay: true, volume: 0.2 },
    ],
};

export const actionCreators = {
    playPauseVolume: (sound) => ({ type: PLAY_PAUSE_VOLUME, sound }),
    pauseSound: (id) => ({ type: PAUSE_SOUND, id })
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === PLAY_PAUSE_VOLUME) {

        let sounds = JSON.parse(JSON.stringify(state.sounds));

        sounds = sounds.filter(s => s.id !== action.sound.id);

        sounds.push(action.sound);

        return { ...state, sounds: sounds }
    }

    if (action.type === PAUSE_SOUND) {

        let sounds = JSON.parse(JSON.stringify(state.sounds));
        for (let s of sounds) {
            if (s.id === action.id) {
                s.isPlay = false;
            }
        }

        return { ...state, sounds: sounds }
    }

    return state;
};
