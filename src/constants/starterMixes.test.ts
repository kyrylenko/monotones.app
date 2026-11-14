import { starterMixes } from './starterMixes';
import { all, categories } from './soundIds';
import en from '../i18n/locales/en.json';
import uk from '../i18n/locales/uk.json';

describe('starterMixes', () => {
    it('has 3 to 6 mixes with unique ids and at least one per use case', () => {
        expect(starterMixes.length).toBeGreaterThanOrEqual(3);
        expect(starterMixes.length).toBeLessThanOrEqual(6);
        expect(new Set(starterMixes.map(m => m.id)).size).toBe(starterMixes.length);
        Object.keys(categories).forEach(category => {
            expect(starterMixes.some(m => m.category === category)).toBe(true);
        });
    });

    it.each(starterMixes.map(m => [m.id, m]))('%s uses catalogue sounds with volumes between 0 and 1', (_, mix) => {
        const entries = Object.entries(mix.volumes);
        expect(entries.length).toBeGreaterThan(0);
        entries.forEach(([id, volume]) => {
            expect(Object.values(all)).toContain(id);
            expect(volume).toBeGreaterThan(0);
            expect(volume).toBeLessThanOrEqual(1);
        });
    });

    it.each(starterMixes.map(m => [m.id]))('%s is translated to English and Ukrainian', (id) => {
        const key = `starter_${id}`;
        expect(en).toHaveProperty([key]);
        expect(uk).toHaveProperty([key]);
    });
});
