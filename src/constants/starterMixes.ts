import type { Category, SoundId } from './soundIds';

export interface StarterMix {
    /** Title translation key is `starter_${id}` */
    id: string;
    /** Use case: shown on the home page and on this category page */
    category: Category;
    /** Tuned volume of each sound, 0..1 */
    volumes: Partial<Record<SoundId, number>>;
}

// Curated mixes for new users, two per use case
export const starterMixes = [
    { id: 'babys_first_night', category: 'sleep', volumes: { brown_noise: 0.35, heartbeat: 0.25 } },
    { id: 'starry_night', category: 'sleep', volumes: { summer_night: 0.4, space_drone: 0.15, wind_chimes: 0.1 } },
    { id: 'rainy_evening', category: 'relax', volumes: { october_rain: 0.4, campfire: 0.3, vinyl_cracks: 0.1 } },
    { id: 'summer_meadow', category: 'relax', volumes: { summer_day: 0.35, river_stream: 0.25, tropical_birds: 0.15 } },
    { id: 'deep_work', category: 'focus', volumes: { deep_space: 0.3, thunderstorm: 0.3 } },
    { id: 'night_train', category: 'focus', volumes: { inside_train: 0.4, october_rain: 0.2 } },
] as const satisfies readonly StarterMix[];

export type StarterMixId = (typeof starterMixes)[number]['id'];
