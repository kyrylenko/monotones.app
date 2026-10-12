import { aggregateSounds, idToTitle } from './sounds';

describe('aggregateSounds', () => {
    it('returns the 28 sounds grouped by category in page order', () => {
        const categories = aggregateSounds();

        expect(Object.keys(categories)).toEqual(['relax', 'sleep', 'focus']);
        expect(Object.values(categories).flat()).toHaveLength(28);
        expect(categories.relax).toHaveLength(12);
        expect(categories.sleep).toHaveLength(8);
        expect(categories.focus).toHaveLength(8);
    });

    it('uses defaults for sounds without settings', () => {
        expect(aggregateSounds().sleep[0]).toEqual({ id: 'summer_night', isPlay: false, volume: 0.3, isLoaded: false });
    });

    it('applies the user settings', () => {
        const { relax, sleep } = aggregateSounds({ campfire: { id: 'campfire', isPlay: true, volume: 1, isLoaded: true } });

        expect(relax.find(x => x.id === 'campfire')).toEqual({ id: 'campfire', isPlay: true, volume: 1, isLoaded: true });
        expect(sleep.find(x => x.id === 'summer_night')?.isPlay).toBe(false);
    });
});

describe('idToTitle', () => {
    it('capitalizes and replaces underscores', () => {
        expect(idToTitle('tropical_birds')).toBe('Tropical birds');
        expect(idToTitle('farm')).toBe('Farm');
    });
});
