import { createSelector } from '@reduxjs/toolkit';
import { aggregateSounds } from '../utils/sounds';

// Play state is not persisted, so it is undefined right after a reload
export const selectIsGlobalPlay = (state) => state.main.isGlobalPlay === true;
export const selectSounds = (state) => state.main.sounds;
export const selectMixtures = (state) => state.main.mixtures || [];
export const selectTimer = (state) => state.timer;

export const selectActiveSounds = createSelector(
    [selectSounds],
    (sounds) => Object.values(sounds).filter(s => s.isPlay)
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
