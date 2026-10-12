// Vite replacement for CRA's dynamic require(`./sounds/${id}.mp3`)
const sounds = import.meta.glob('./sounds/*.mp3', { eager: true, import: 'default' });
const icons = import.meta.glob('./icons/white/*.webp', { eager: true, import: 'default' });

export const soundUrl = (id) => sounds[`./sounds/${id}.mp3`];
export const iconUrl = (id) => icons[`./icons/white/${id}.webp`];
