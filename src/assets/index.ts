import type { SoundId } from '../constants/soundIds';

// Vite replacement for CRA's dynamic require(`./sounds/${id}.mp3`)
const sounds = import.meta.glob<string>('./sounds/*.mp3', { eager: true, import: 'default' });
const icons = import.meta.glob<string>('./icons/white/*.webp', { eager: true, import: 'default' });

export const soundUrl = (id: SoundId): string => sounds[`./sounds/${id}.mp3`];
export const iconUrl = (id: SoundId): string => icons[`./icons/white/${id}.webp`];
