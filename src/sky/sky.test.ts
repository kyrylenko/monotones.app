import { RIPPLE_SPEED, WAVE_EVERY, addRipple, breath, createSky, starPosition, step, swipe, swirl, tilt } from './sky';

const frame = { width: 400, height: 800, isPlaying: false, isCalm: false };
// Deterministic "random": stars all start at the same values
const fixed = (value: number) => () => value;

describe('sky', () => {
    it('lights the stars a tap ripple passes', () => {
        const sky = createSky(1, fixed(0.5));
        const star = sky.stars[0];
        const { x, y } = starPosition(sky, star, 400, 800);
        addRipple(sky, x - 100, y);

        step(sky, 100 / RIPPLE_SPEED, frame);

        expect(star.glow).toBe(1);
        expect(star.vx).toBeGreaterThan(0); // pushed away from the tap
    });

    it('fades the ripple and the glow out', () => {
        const sky = createSky(1, fixed(0.5));
        sky.stars[0].glow = 1;
        addRipple(sky, 0, 0);

        for (let i = 0; i < 60; i++) step(sky, 0.1, frame);

        expect(sky.ripples).toEqual([]);
        expect(sky.stars[0].glow).toBeLessThan(0.01);
    });

    it('a swipe sends the stars drifting that way, then they settle', () => {
        const sky = createSky(3, fixed(0.5));
        swipe(sky, 20, 0);
        const before = sky.stars[0].x;

        step(sky, 0.1, frame);
        expect(sky.stars[0].x).toBeGreaterThan(before);

        for (let i = 0; i < 100; i++) step(sky, 0.1, frame);
        expect(Math.abs(sky.stars[0].vx)).toBeLessThan(0.1);
        expect(sky.stars[0].x).toBeGreaterThanOrEqual(0);
        expect(sky.stars[0].x).toBeLessThan(1);
    });

    it('a screen turn swirls the stars around the center', () => {
        const sky = createSky(1, fixed(0.75));
        swirl(sky, 400, 800);
        // right of and below the center: the swirl moves it down-left (clockwise)
        expect(sky.stars[0].vx).toBeLessThan(0);
        expect(sky.stars[0].vy).toBeGreaterThan(0);
    });

    it('tilt shifts the stars gradually', () => {
        const sky = createSky(1, fixed(0.5));
        tilt(sky, 1, 0);
        step(sky, 0.1, frame);
        const shifted = starPosition(sky, sky.stars[0], 400, 800).x;

        expect(shifted).toBeLessThan(200);
        expect(shifted).toBeGreaterThan(200 - 16);
    });

    it('sends waves from the moon only while playing and not in calm mode', () => {
        const sky = createSky(0);
        step(sky, 0.1, frame);
        expect(sky.waves).toEqual([]);

        step(sky, 0.1, { ...frame, isPlaying: true, isCalm: true });
        expect(sky.waves).toEqual([]);

        step(sky, 0.1, { ...frame, isPlaying: true });
        expect(sky.waves).toHaveLength(1);
        step(sky, WAVE_EVERY / 2, { ...frame, isPlaying: true });
        expect(sky.waves).toHaveLength(1);
    });

    it('breathes on a 10 second cycle', () => {
        expect(breath(0)).toBeCloseTo(0.5);
        expect(breath(2.5)).toBeCloseTo(1);
        expect(breath(7.5)).toBeCloseTo(0);
        expect(breath(10)).toBeCloseTo(0.5);
    });
});
