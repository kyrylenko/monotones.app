import { all, type ShareCode } from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';
import type { SharedSound, Sounds } from '../types';

export const SHARE_BASE_URL = 'https://monotones.app';

const SHARE_CODES = Object.keys(all) as ShareCode[];

// One character per volume in 0.05 steps: '0' = 0, '6' = 0.3, 'K' = 1.
// Digits and capitals never clash with the lowercase sound codes.
const VOLUME_CHARS = '0123456789ABCDEFGHIJK';
const VOLUME_STEPS = VOLUME_CHARS.length - 1;

const encodeVolume = (volume: number): string =>
    VOLUME_CHARS[Math.round(Math.min(1, Math.max(0, volume)) * VOLUME_STEPS)];

// Playing sounds => code and volume of each in catalogue order, e.g. 'ce6kb8'
export const encodeShareCode = (sounds: Sounds): string =>
    SHARE_CODES
        .filter(code => sounds[all[code]]?.isPlay)
        .map(code => code + encodeVolume(sounds[all[code]]!.volume))
        .join('');

// Codes of removed sounds => the sound that replaced them, so old links keep working
const LEGACY_CODES: Record<string, ShareCode> = {
    pe: 'bn', // pink noise => brown noise
};

const WITH_VOLUMES = new RegExp(`^([a-z]{2}[${VOLUME_CHARS}])+$`);

// 'ce6kb8' => ce at 0.3, kb at 0.4.
// Old links have no volumes ('cekb', odd length strings start with a one-letter chunk) and get the default volume.
export const decodeShareCode = (code: string): SharedSound[] => {
    if (WITH_VOLUMES.test(code)) {
        return code.match(/.{3}/g)!.map(chunk => ({
            code: LEGACY_CODES[chunk.slice(0, 2)] ?? chunk.slice(0, 2),
            volume: VOLUME_CHARS.indexOf(chunk[2]) / VOLUME_STEPS,
        }));
    }
    return (code.match(/.{1,2}(?=(.{2})+(?!.))|.{1,2}$/g) ?? [])
        .map(chunk => ({ code: LEGACY_CODES[chunk] ?? chunk, volume: defaultValues.defaultVolume }));
};

// The optional mix name is shown to the recipient (see components/SharedMixBanner.tsx)
export const buildShareUrl = (sounds: Sounds, name?: string): string => {
    const code = encodeShareCode(sounds);
    if (!code) {
        return SHARE_BASE_URL;
    }
    return `${SHARE_BASE_URL}/share/${code}${name ? `?name=${encodeURIComponent(name)}` : ''}`;
};
