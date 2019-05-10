import { all } from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';

export const GLOBAL_PLAY_PAUSE = 'GLOBAL_PLAY_PAUSE';
export const PLAY_PAUSE_VOLUME = 'PLAY_PAUSE_VOLUME';
export const SET_SOUNDS = 'SET_SOUNDS';
export const PAUSE_SOUND = 'PAUSE_SOUND';
export const ADD = 'ADD';
export const DEL = 'DEL';
export const SWITCH = 'SWITCH';
export const DEACTIVATE = 'DEACTIVATE';
export const SET_SOUND_LOADED = 'SET_SOUND_LOADED';


const mainState = {
    isGlobalPlay: false,
    sounds: {},
    mixtures: [],
};

export const actionCreators = {
    globalPlayPause: (isGlobalPlay) => ({ type: GLOBAL_PLAY_PAUSE, isGlobalPlay }),
    playPauseVolume: (sound) => ({ type: PLAY_PAUSE_VOLUME, sound }),
    pauseSound: (id) => ({ type: PAUSE_SOUND, id }),
    setSounds: (sounds) => ({ type: SET_SOUNDS, sounds }),
    setSoundLoaded: (id) => ({ type: SET_SOUND_LOADED, id }),
};
export const mixtureActionCreators = {
    addMixture: (title) => ({ type: ADD, title }),
    deleteMixture: (id) => ({ type: DEL, id }),
    switchMixture: (id) => ({ type: SWITCH, id }),
    deactivateMixtures: () => ({ type: DEACTIVATE }),
};

export const mainReducer = (state, action) => {
    state = state || mainState;

    if (action.type === GLOBAL_PLAY_PAUSE) {
        return { ...state, isGlobalPlay: action.isGlobalPlay }
    }

    if (action.type === PLAY_PAUSE_VOLUME) {
        //Deactivate the Active mixture        
        const mixtures = JSON.parse(JSON.stringify(state.mixtures || []))
            .map(x => ({ ...x, isActive: false }));

        return {
            ...state,
            sounds: { ...state.sounds, [action.sound.id]: action.sound },
            mixtures: mixtures,
            isGlobalPlay: action.sound.isPlay ? true : state.isGlobalPlay
        }
    }

    if (action.type === SET_SOUNDS) {
        const sounds = action.sounds
            .filter(x => x in all)
            .reduce((obj, x) => {
                obj[all[x]] = {
                    id: all[x],
                    isPlay: true,
                    volume: defaultValues.defaultVolume
                };
                return obj
            }, {});

        return { ...state, sounds }
    }

    if (action.type === SET_SOUND_LOADED) {
        const sounds = { ...state.sounds, [action.id]: { ...state.sounds[action.id], isLoaded: true } };
        return { ...state, sounds }
    }

    if (action.type === PAUSE_SOUND) {
        const sounds = { ...state.sounds, [action.id]: { ...state.sounds[action.id], isPlay: false } };
        //Deactivate the Active mixture
        const mixtures = JSON.parse(JSON.stringify(state.mixtures || []))
            .map(x => ({ ...x, isActive: false }));

        return { ...state, sounds: sounds, mixtures: mixtures }
    }

    if (action.type === ADD) {
        const mixture = {
            sounds: { ...state.sounds },
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