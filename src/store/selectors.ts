import { createSelector } from '@reduxjs/toolkit';
import { aggregateSounds } from '../utils/sounds';
import type { RootState } from './index';
import type { SoundSetting } from '../types';

export const selectIsGlobalPlay = (state: RootState) => state.main.isGlobalPlay;
export const selectSounds = (state: RootState) => state.main.sounds;
export const selectMixtures = (state: RootState) => state.main.mixtures;
export const selectTimer = (state: RootState) => state.timer;

export const selectActiveSounds = createSelector(
    [selectSounds],
    (sounds) => Object.values(sounds).filter((s): s is SoundSetting => !!s?.isPlay)
);

// Every sound of the catalogue with its current settings, grouped by category
export const selectSoundsByCategory = createSelector(
    [selectSounds],
    (sounds) => aggregateSounds(sounds)
);

export const selectAllSounds = createSelector(
    [selectSoundsByCategory],
    (categories) => Object.values(categories).flat()
);
