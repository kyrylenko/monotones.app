import { createSlice, current, type PayloadAction } from '@reduxjs/toolkit';
import { all, isShareCode, type ShareCode, type SoundId } from '../constants/soundIds';
import { starterMixes, type StarterMixId } from '../constants/starterMixes';
import type { Mixture, SharedSound, SoundSetting, Sounds } from '../types';

// State shape is persisted to localStorage (see store/index.ts), keep it backward compatible.
export interface MainState {
    isGlobalPlay: boolean;
    sounds: Sounds;
    mixtures: Mixture[];
    /** Id of the playing starter mix (see constants/starterMixes.ts), it is active like a saved mixture */
    activeStarterMix: string | null;
    /** Name of a mix opened from a share link, until it is saved, changed or dismissed */
    sharedMixName: string | null;
}

const initialState: MainState = {
    isGlobalPlay: false,
    sounds: {},
    mixtures: [],
    activeStarterMix: null,
    sharedMixName: null,
};

// Starter and shared mixes are not saved mixtures, but are active like them
const clearUnsavedMix = (state: MainState) => {
    state.activeStarterMix = null;
    state.sharedMixName = null;
};

const deactivateAll = (state: MainState) => {
    state.mixtures = state.mixtures.map(m => ({ ...m, isActive: false }));
    clearUnsavedMix(state);
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
        // Replaces all sounds with the ones of a share link (see utils/shareCode.ts), unknown codes are ignored
        setSounds(state, { payload: shared }: PayloadAction<SharedSound[]>) {
            const known = shared.filter((sound): sound is SharedSound & { code: ShareCode } => isShareCode(sound.code));
            state.sounds = Object.fromEntries(known.map(({ code, volume }) => [all[code], { id: all[code], isPlay: true, volume }]));
            deactivateAll(state);
        },
        // Set after setSounds when the link has a name, null when the user dismisses it
        setSharedMixName(state, { payload: name }: PayloadAction<string | null>) {
            state.sharedMixName = name;
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
            clearUnsavedMix(state);
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
                clearUnsavedMix(state);
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
            clearUnsavedMix(state);
        },
        // Same as switching to a saved mixture: loads the sounds with their tuned volumes and plays them
        playStarterMix(state, { payload: id }: PayloadAction<StarterMixId>) {
            const mix = starterMixes.find(m => m.id === id);
            if (!mix || state.activeStarterMix === id) {
                return;
            }

            deactivateAll(state);
            state.isGlobalPlay = true;
            state.sounds = Object.fromEntries(Object.entries(mix.volumes)
                .map(([soundId, volume]) => [soundId, { id: soundId as SoundId, isPlay: true, volume }]));
            state.activeStarterMix = id;
        },
        // Clicking the active saved mixture or starter mix: deactivates it and pauses
        deactivateMixtures(state) {
            deactivateAll(state);
            state.isGlobalPlay = false;
        },
    },
});

export const mainActions = mainSlice.actions;
export const mainReducer = mainSlice.reducer;
