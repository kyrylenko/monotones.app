import { createSlice, current } from '@reduxjs/toolkit';
import { all } from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';

// State shape is persisted to localStorage (see store/index.js), keep it backward compatible.
const initialState = {
    isGlobalPlay: false,
    sounds: {},
    mixtures: [],
};

// Older persisted states may miss `mixtures`
const deactivateAll = (state) => {
    state.mixtures = (state.mixtures || []).map(m => ({ ...m, isActive: false }));
};

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        globalPlayPause(state, { payload: isGlobalPlay }) {
            state.isGlobalPlay = isGlobalPlay;
        },
        // Toggles a sound or changes its volume; any manual change detaches from the active mixture
        playPauseVolume(state, { payload: sound }) {
            state.sounds[sound.id] = sound;
            deactivateAll(state);
            if (sound.isPlay) {
                state.isGlobalPlay = true;
            }
        },
        pauseSound(state, { payload: id }) {
            state.sounds[id] = { ...state.sounds[id], isPlay: false };
            deactivateAll(state);
        },
        // Replaces all sounds with the given share codes (see utils/shareCode.js)
        setSounds(state, { payload: codes }) {
            state.sounds = Object.fromEntries(codes
                .filter(code => code in all)
                .map(code => [all[code], { id: all[code], isPlay: true, volume: defaultValues.defaultVolume }]));
            deactivateAll(state);
        },
        setSoundLoaded(state, { payload: id }) {
            // The sound may have been removed while its file was loading
            if (state.sounds[id]) {
                state.sounds[id].isLoaded = true;
            }
        },
        addMixture(state, { payload: title }) {
            const others = (state.mixtures || [])
                .filter(m => m.id !== title)
                .map(m => ({ ...m, isActive: false }));

            state.mixtures = [{ sounds: { ...state.sounds }, id: title, isActive: true }, ...others];
        },
        // Deleting the active mixture activates the first remaining one and loads its sounds
        deleteMixture(state, { payload: id }) {
            state.mixtures = state.mixtures.filter(m => m.id !== id);
            if (state.mixtures.length && !state.mixtures.some(m => m.isActive)) {
                state.mixtures[0].isActive = true;
            }

            const active = state.mixtures.find(m => m.isActive);
            if (active) {
                state.sounds = { ...current(active).sounds };
            }
        },
        switchMixture(state, { payload: id }) {
            const target = state.mixtures.find(m => m.id === id);
            if (!target || target.isActive) {
                return;
            }

            state.isGlobalPlay = true;
            state.sounds = { ...current(target).sounds };
            state.mixtures.forEach(m => { m.isActive = m.id === id; });
        },
        deactivateMixtures(state) {
            deactivateAll(state);
            state.isGlobalPlay = false;
        },
    },
});

export const mainActions = mainSlice.actions;
export const mainReducer = mainSlice.reducer;
