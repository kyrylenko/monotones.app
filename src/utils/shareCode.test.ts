import { encodeShareCode, decodeShareCode, buildShareUrl } from './shareCode';
import type { SoundId } from '../constants/soundIds';
import type { Sounds } from '../types';

const playing = (...ids: SoundId[]): Sounds => Object.fromEntries(ids.map(id => [id, { id, isPlay: true, volume: 0.3 }]));

describe('encodeShareCode', () => {
    it('encodes playing sounds in catalogue order, each with its volume', () => {
        expect(encodeShareCode(playing('keyboard', 'campfire'))).toBe('ce6kb6');
    });

    it('encodes volumes in 0.05 steps with one character', () => {
        const sounds: Sounds = {
            campfire: { id: 'campfire', isPlay: true, volume: 0 },
            farm: { id: 'farm', isPlay: true, volume: 0.52 },
            keyboard: { id: 'keyboard', isPlay: true, volume: 1 },
        };
        expect(encodeShareCode(sounds)).toBe('ce0fmAkbK');
    });

    it('skips paused sounds', () => {
        const sounds = { ...playing('campfire'), farm: { id: 'farm' as const, isPlay: false, volume: 0.3 } };
        expect(encodeShareCode(sounds)).toBe('ce6');
    });

    it('encodes generated sounds like the others', () => {
        expect(encodeShareCode(playing('brown_noise', 'white_noise'))).toBe('wn6bn6');
    });

    it('is empty when nothing plays', () => {
        expect(encodeShareCode({})).toBe('');
    });
});

describe('decodeShareCode', () => {
    it('reads codes with volumes', () => {
        expect(decodeShareCode('ce6kb0nsK')).toEqual([
            { code: 'ce', volume: 0.3 },
            { code: 'kb', volume: 0 },
            { code: 'ns', volume: 1 },
        ]);
    });

    it('round-trips the encoded sounds and volumes', () => {
        const sounds: Sounds = {
            campfire: { id: 'campfire', isPlay: true, volume: 0.35 },
            keyboard: { id: 'keyboard', isPlay: true, volume: 0.8 },
        };
        expect(decodeShareCode(encodeShareCode(sounds))).toEqual([
            { code: 'ce', volume: 0.35 },
            { code: 'kb', volume: 0.8 },
        ]);
    });

    describe('old links without volumes', () => {
        it('splits into two-letter codes with the default volume', () => {
            expect(decodeShareCode('cekbns')).toEqual([
                { code: 'ce', volume: 0.3 },
                { code: 'kb', volume: 0.3 },
                { code: 'ns', volume: 0.3 },
            ]);
        });

        it('puts the odd letter first', () => {
            expect(decodeShareCode('xcekb').map(s => s.code)).toEqual(['x', 'ce', 'kb']);
        });

        it('opens brown noise for old pink noise links', () => {
            expect(decodeShareCode('cepe').map(s => s.code)).toEqual(['ce', 'bn']);
        });
    });

    it('handles empty input', () => {
        expect(decodeShareCode('')).toEqual([]);
    });
});

describe('buildShareUrl', () => {
    it('links to the shared sounds', () => {
        expect(buildShareUrl(playing('campfire'))).toBe('https://monotones.app/share/ce6');
    });

    it('adds the mix name', () => {
        expect(buildShareUrl(playing('campfire'), 'Rainy evening & tea')).toBe('https://monotones.app/share/ce6?name=Rainy%20evening%20%26%20tea');
    });

    it('links to the home page when nothing plays', () => {
        expect(buildShareUrl({}, 'Evening')).toBe('https://monotones.app');
    });

    it('stays short for messengers: three characters per sound', () => {
        const eight = playing('campfire', 'farm', 'keyboard', 'brown_noise', 'summer_night', 'october_rain', 'thunderstorm', 'kitty_purr');
        expect(buildShareUrl(eight, 'Rainy evening')).toHaveLength(73);
    });
});
