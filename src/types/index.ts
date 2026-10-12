import type { SoundId } from '../constants/soundIds';

/** User settings of one sound, as stored in Redux and localStorage */
export interface SoundSetting {
    id: SoundId;
    isPlay: boolean;
    volume: number;
    /** The audio file was loaded and started playing at least once */
    isLoaded?: boolean;
}

/** Settings by sound id. Only sounds the user touched have an entry. */
export type Sounds = Partial<Record<SoundId, SoundSetting>>;

/** A saved set of sounds; the title is used as the id */
export interface Mixture {
    id: string;
    sounds: Sounds;
    isActive: boolean;
}

/** A catalogue sound merged with the user's settings */
export interface SoundState {
    id: SoundId;
    isPlay: boolean;
    volume: number;
    isLoaded: boolean;
}
