import soundIds from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';

export const GLOBAL_PLAY_PAUSE = 'GLOBAL_PLAY_PAUSE';
export const PLAY_PAUSE_VOLUME = 'PLAY_PAUSE_VOLUME';
export const SET_SOUNDS = 'SET_SOUNDS';
export const PAUSE_SOUND = 'PAUSE_SOUND';
export const ADD = 'ADD';
export const DEL = 'DEL';
export const SWITCH = 'SWITCH';
export const DEACTIVATE = 'DEACTIVATE';
export const TIMER_START = 'TIMER_START';
export const TIMER_STOP = 'TIMER_STOP';

const mainState = {
    isGlobalPlay: false,
    sounds: [],
    mixtures: [],
};

const timerState = {
    timerRun: false,
    interval: 1
};

export const actionCreators = {
    globalPlayPause: (isGlobalPlay) => ({ type: GLOBAL_PLAY_PAUSE, isGlobalPlay }),
    playPauseVolume: (sound) => ({ type: PLAY_PAUSE_VOLUME, sound }),
    pauseSound: (id) => ({ type: PAUSE_SOUND, id }),
    setSounds: (sounds) => ({ type: SET_SOUNDS, sounds }),

    addMixture: (title) => ({ type: ADD, title }),
    deleteMixture: (id) => ({ type: DEL, id }),
    switchMixture: (id) => ({ type: SWITCH, id }),
    deactivateMixtures: () => ({ type: DEACTIVATE }),

    timerStart: (interval) => ({ type: TIMER_START, interval }),
    timerStop: () => ({ type: TIMER_STOP })
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

export const reducer = (state, action) => {
    state = state || mainState;

    if (action.type === GLOBAL_PLAY_PAUSE) {
        return { ...state, isGlobalPlay: action.isGlobalPlay }
    }

    if (action.type === PLAY_PAUSE_VOLUME) {
        let sounds = JSON.parse(JSON.stringify(state.sounds));

        sounds = sounds.filter(s => s.id !== action.sound.id);

        sounds.push(action.sound);
        //Deactivate the Active mixture
        const mixtures = JSON.parse(JSON.stringify(state.mixtures || []))
            .map(x => ({ ...x, isActive: false }));

        return {
            ...state,
            sounds: sounds,
            mixtures: mixtures,
            isGlobalPlay: action.sound.isPlay ? true : state.isGlobalPlay
        }
    }

    if (action.type === SET_SOUNDS) {
        const sounds = action.sounds
            .filter(x => x in soundIds)
            .map(x => ({
                id: soundIds[x],
                isPlay: true,
                volume: defaultValues.defaultVolume
            }));

        return { ...state, sounds }
    }

    if (action.type === PAUSE_SOUND) {
        let sounds = JSON.parse(JSON.stringify(state.sounds));
        for (let s of sounds) {
            if (s.id === action.id) {
                s.isPlay = false;
            }
        }

        //Deactivate the Active mixture
        const mixtures = JSON.parse(JSON.stringify(state.mixtures || []))
            .map(x => ({ ...x, isActive: false }));

        return { ...state, sounds: sounds, mixtures: mixtures }
    }

    if (action.type === ADD) {
        const sounds = JSON.parse(JSON.stringify(state.sounds));
        const mixture = {
            sounds,
            id: action.title,
            isActive: true
        };

        return {
            ...state,
            mixtures: [mixture].concat((state.mixtures || [])
                //prevent duplicate titles (IDs) by filter out if already exists
                .filter((m) => m.id !== action.title)
                .map((m) => {
                    m.isActive = false;
                    return m
                }))
        }
    }

    if (action.type === DEL) {
        let filtered = state.mixtures.filter((m) => m.id !== action.id);
        if (filtered.length && !filtered.some(m => m.isActive === true)) {
            //TODO: is there a need to have an active mixture?
            filtered[0].isActive = true;
        }

        return {
            ...state,
            sounds: filtered.some(x => x.isActive === true)
                ? JSON.parse(JSON.stringify(filtered.find(x => x.isActive === true))).sounds
                : state.sounds,
            mixtures: filtered
        }
    }

    if (action.type === SWITCH) {
        if (state.mixtures.some(m => m.isActive !== true && m.id === action.id)) {
            return {
                ...state,
                isGlobalPlay: true,
                sounds: JSON.parse(JSON.stringify(state.mixtures.find(x => x.id === action.id))).sounds,
                mixtures: state.mixtures.map((m) => {
                    m.isActive = m.id === action.id;
                    return m
                })
            }
        }
    }

    if (action.type === DEACTIVATE) {
        //Deactivate the Active mixture
        const mixtures = JSON.parse(JSON.stringify(state.mixtures || []))
            .map(x => ({ ...x, isActive: false }));

        return { ...state, mixtures: mixtures, isGlobalPlay: false }
    }
    return state;
};
