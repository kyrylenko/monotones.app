import { categories } from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';

// 'tropical_birds' => 'Tropical birds'
export const idToTitle = (id) => `${id[0].toUpperCase()}${id.slice(1)}`.replace(/_/g, ' ');

// Merges the sound catalogue with the user's settings: { relax: [...], sleep: [...], focus: [...] }
export const aggregateSounds = (settings = {}) => Object.fromEntries(
    Object.entries(categories).map(([category, ids]) => [
        category,
        Object.values(ids).map(id => {
            const setting = settings[id];
            return {
                id,
                isPlay: setting ? setting.isPlay : false,
                volume: setting ? setting.volume : defaultValues.defaultVolume,
                isLoaded: setting ? setting.isLoaded : false,
            };
        }),
    ])
);
