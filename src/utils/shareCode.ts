import { all } from '../constants/soundIds';

export const SHARE_BASE_URL = 'https://monotones.app';

// Playing sounds => two-letter codes in catalogue order, e.g. 'cekb'
export const encodeShareCode = (sounds) => {
    const playingIds = Object.values(sounds).filter(s => s.isPlay).map(s => s.id);
    return Object.entries(all)
        .filter(([, id]) => playingIds.includes(id))
        .map(([code]) => code)
        .join('');
};

// 'cekb' => ['ce', 'kb']. Odd length strings start with a one-letter chunk.
export const decodeShareCode = (code) => code.match(/.{1,2}(?=(.{2})+(?!.))|.{1,2}$/g) || [];

export const buildShareUrl = (sounds) => {
    const code = encodeShareCode(sounds);
    return code ? `${SHARE_BASE_URL}/share/${code}` : SHARE_BASE_URL;
};
