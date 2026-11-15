import type { TFunction } from 'i18next';
import { starterMixes } from '../constants/starterMixes';
import type { RootState } from '../store';

// Name of the active mix: a saved mixture, a starter mix or a mix opened from a link; null for the user's own changes
export const activeMixName = (state: RootState, t: TFunction): string | null => {
    const starterMix = starterMixes.find(mix => mix.id === state.main.activeStarterMix);
    return state.main.mixtures.find(mixture => mixture.isActive)?.id
        ?? (starterMix ? t(`starter_${starterMix.id}`) : state.main.sharedMixName);
};
