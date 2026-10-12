import { FADE_OUT_SECONDS, fadeOutLevel } from './fadeOut';

describe('fadeOutLevel', () => {
    it('keeps full volume before the fade starts', () => {
        expect(fadeOutLevel(300)).toBe(1);
        expect(fadeOutLevel(FADE_OUT_SECONDS)).toBe(1);
    });

    it('lowers the volume faster at the start of the fade than a linear fade', () => {
        expect(fadeOutLevel(FADE_OUT_SECONDS / 2)).toBe(0.25);
        expect(fadeOutLevel(FADE_OUT_SECONDS - 1)).toBeLessThan(1);
    });

    it('reaches silence at the end', () => {
        expect(fadeOutLevel(0)).toBe(0);
        expect(fadeOutLevel(-5)).toBe(0);
    });
});
