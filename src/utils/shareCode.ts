import { all, type ShareCode } from '../constants/soundIds';
import type { Sounds } from '../types';

export const SHARE_BASE_URL = 'https://monotones.app';

const SHARE_CODES = Object.keys(all) as ShareCode[];

// Playing sounds => two-letter codes in catalogue order, e.g. 'cekb'
export const encodeShareCode = (sounds: Sounds): string =>
    SHARE_CODES.filter(code => sounds[all[code]]?.isPlay).join('');

// Codes of removed sounds => the sound that replaced them, so old links keep working
const LEGACY_CODES: Record<string, ShareCode> = {
    pe: 'bn', // pink noise => brown noise
};

// 'cekb' => ['ce', 'kb']. Odd length strings start with a one-letter chunk.
export const decodeShareCode = (code: string): string[] =>
    (code.match(/.{1,2}(?=(.{2})+(?!.))|.{1,2}$/g) ?? []).map(chunk => LEGACY_CODES[chunk] ?? chunk);

export const buildShareUrl = (sounds: Sounds): string => {
    const code = encodeShareCode(sounds);
    return code ? `${SHARE_BASE_URL}/share/${code}` : SHARE_BASE_URL;
};
