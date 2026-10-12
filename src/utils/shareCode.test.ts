import { encodeShareCode, decodeShareCode, buildShareUrl } from './shareCode';
import type { SoundId } from '../constants/soundIds';
import type { Sounds } from '../types';

const playing = (...ids: SoundId[]): Sounds => Object.fromEntries(ids.map(id => [id, { id, isPlay: true, volume: 0.3 }]));

describe('encodeShareCode', () => {
    it('encodes playing sounds in catalogue order', () => {
        expect(encodeShareCode(playing('keyboard', 'campfire'))).toBe('cekb');
    });

    it('skips paused sounds', () => {
        const sounds = { ...playing('campfire'), farm: { id: 'farm' as const, isPlay: false, volume: 0.3 } };
        expect(encodeShareCode(sounds)).toBe('ce');
    });

    it('is empty when nothing plays', () => {
        expect(encodeShareCode({})).toBe('');
    });
});

describe('decodeShareCode', () => {
    it('splits into two-letter codes', () => {
        expect(decodeShareCode('cekbns')).toEqual(['ce', 'kb', 'ns']);
    });

    it('puts the odd letter first', () => {
        expect(decodeShareCode('xcekb')).toEqual(['x', 'ce', 'kb']);
    });

    it('handles empty input', () => {
        expect(decodeShareCode('')).toEqual([]);
    });
});

describe('buildShareUrl', () => {
    it('links to the shared sounds', () => {
        expect(buildShareUrl(playing('campfire'))).toBe('https://monotones.app/share/ce');
    });

    it('links to the home page when nothing plays', () => {
        expect(buildShareUrl({})).toBe('https://monotones.app');
    });
});
