import { categories, type Category, type SoundId } from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';
import type { Sounds, SoundState } from '../types';

// 'tropical_birds' => 'Tropical birds'
export const idToTitle = (id: string): string => `${id[0].toUpperCase()}${id.slice(1)}`.replace(/_/g, ' ');

// Merges the sound catalogue with the user's settings: { relax: [...], sleep: [...], focus: [...] }
export const aggregateSounds = (settings: Sounds = {}): Record<Category, SoundState[]> => {
    const toState = (id: SoundId): SoundState => {
        const setting = settings[id];
        return {
            id,
            isPlay: setting ? setting.isPlay : false,
            volume: setting ? setting.volume : defaultValues.defaultVolume,
            isLoaded: setting?.isLoaded ?? false,
        };
    };

    return {
        relax: Object.values(categories.relax).map(toState),
        sleep: Object.values(categories.sleep).map(toState),
        focus: Object.values(categories.focus).map(toState),
    };
};
