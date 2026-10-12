import { createSlice, current, type PayloadAction } from '@reduxjs/toolkit';
import { all, isShareCode, type SoundId } from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';
import type { Mixture, SoundSetting, Sounds } from '../types';

// State shape is persisted to localStorage (see store/index.ts), keep it backward compatible.
export interface MainState {
    isGlobalPlay: boolean;
    sounds: Sounds;
    mixtures: Mixture[];
}

const initialState: MainState = {
    isGlobalPlay: false,
    sounds: {},
    mixtures: [],
};

const deactivateAll = (state: MainState) => {
    state.mixtures = state.mixtures.map(m => ({ ...m, isActive: false }));
};

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        globalPlayPause(state, { payload: isGlobalPlay }: PayloadAction<boolean>) {
            state.isGlobalPlay = isGlobalPlay;
        },
        // Toggles a sound or changes its volume; any manual change detaches from the active mixture
        playPauseVolume(state, { payload: sound }: PayloadAction<SoundSetting>) {
            state.sounds[sound.id] = sound;
            deactivateAll(state);
            if (sound.isPlay) {
                state.isGlobalPlay = true;
            }
        },
        pauseSound(state, { payload: id }: PayloadAction<SoundId>) {
            // Only playing sounds can be paused, so the entry exists
            state.sounds[id] = { ...state.sounds[id]!, isPlay: false };
            deactivateAll(state);
        },
        // Replaces all sounds with the given share codes (see utils/shareCode.ts), unknown codes are ignored
        setSounds(state, { payload: codes }: PayloadAction<string[]>) {
            state.sounds = Object.fromEntries(codes
                .filter(isShareCode)
                .map(code => [all[code], { id: all[code], isPlay: true, volume: defaultValues.defaultVolume }]));
            deactivateAll(state);
        },
        setSoundLoaded(state, { payload: id }: PayloadAction<SoundId>) {
            // The sound may have been removed while its file was loading
            const sound = state.sounds[id];
            if (sound) {
                sound.isLoaded = true;
            }
        },
        addMixture(state, { payload: title }: PayloadAction<string>) {
            const others = state.mixtures
                .filter(m => m.id !== title)
                .map(m => ({ ...m, isActive: false }));

            state.mixtures = [{ sounds: { ...state.sounds }, id: title, isActive: true }, ...others];
        },
        // Deleting the active mixture activates the first remaining one and loads its sounds
        deleteMixture(state, { payload: id }: PayloadAction<string>) {
            state.mixtures = state.mixtures.filter(m => m.id !== id);
            if (state.mixtures.length && !state.mixtures.some(m => m.isActive)) {
                state.mixtures[0].isActive = true;
            }

            const active = state.mixtures.find(m => m.isActive);
            if (active) {
                state.sounds = { ...current(active).sounds };
            }
        },
        switchMixture(state, { payload: id }: PayloadAction<string>) {
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
