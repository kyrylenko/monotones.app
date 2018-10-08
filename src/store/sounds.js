//import soundIds from '../constants/soundIds';

export const PLAY_PAUSE_VOLUME = 'PLAY_PAUSE_VOLUME';
export const PAUSE_SOUND = 'PAUSE_SOUND';
export const ADD = 'ADD';
export const DEL = 'DEL';
export const SWITCH = 'SWITCH';
export const DEACTIVATE = 'DEACTIVATE';

const initialState = {
    sounds: [
        //{ id: soundIds.sailing_yacht, isPlay: true, volume: 0.2 },
        //{ id: soundIds.summer_day, isPlay: true, volume: 0.2 },
    ],
    mixtures: [],
};

export const actionCreators = {
    playPauseVolume: (sound) => ({ type: PLAY_PAUSE_VOLUME, sound }),
    pauseSound: (id) => ({ type: PAUSE_SOUND, id }),

    addMixture: (title) => ({ type: ADD, title }),
    deleteMixture: (id) => ({ type: DEL, id }),
    switchMixture: (id) => ({ type: SWITCH, id }),
    deactivateMixtures: () => ({ type: DEACTIVATE })
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === PLAY_PAUSE_VOLUME) {
        let sounds = JSON.parse(JSON.stringify(state.sounds));

        sounds = sounds.filter(s => s.id !== action.sound.id);

        sounds.push(action.sound);
        //Deactivate the Active mixture
        let mixtures = JSON.parse(JSON.stringify(state.mixtures)).map(x => {
            return { sounds: x.sounds, id: x.id, isActive: false }
        });

        return { ...state, sounds: sounds, mixtures: mixtures }
    }

    if (action.type === PAUSE_SOUND) {
        let sounds = JSON.parse(JSON.stringify(state.sounds));
        for (let s of sounds) {
            if (s.id === action.id) {
                s.isPlay = false;
            }
        }

        //Deactivate the Active mixture
        let mixtures = JSON.parse(JSON.stringify(state.mixtures)).map(x => {
            return { sounds: x.sounds, id: x.id, isActive: false }
        });

        return { ...state, sounds: sounds, mixtures: mixtures }
    }

    if (action.type === ADD) {
        let sounds = JSON.parse(JSON.stringify(state.sounds));
        let mixture = {
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
        let mixtures = JSON.parse(JSON.stringify(state.mixtures)).map(x => {
            return { sounds: x.sounds, id: x.id, isActive: false }
        });

        return { ...state, mixtures: mixtures }
    }
    return state;
};
