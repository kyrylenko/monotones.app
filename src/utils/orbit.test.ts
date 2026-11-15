import { orbitGeometry, orbitRadius, positionToVolume, timerFraction, volumeToPosition } from './orbit';

describe('orbit', () => {
    it('maps volume to the dial and back', () => {
        expect(volumeToPosition(0.25)).toBe(0.5);
        expect(positionToVolume(0.5)).toBe(0.25);
        expect(positionToVolume(volumeToPosition(0.3))).toBeCloseTo(0.3);
        // never fully silent or past the moon
        expect(positionToVolume(-1)).toBe(0.01);
        expect(positionToVolume(2)).toBe(1);
        expect(volumeToPosition(0)).toBe(0.1);
    });

    it('puts loud sounds close to the moon', () => {
        const geo = orbitGeometry(390, 500);
        expect(orbitRadius(geo, 1)).toBe(geo.rMin);
        expect(orbitRadius(geo, 0)).toBe(geo.rMax);
        expect(geo.rMin).toBeLessThan(geo.rMax);
    });

    it('measures the timer against the chosen duration', () => {
        expect(timerFraction(30 * 60)).toBe(1);
        expect(timerFraction(15 * 60)).toBe(1);
        expect(timerFraction(20 * 60)).toBeCloseTo(20 / 30);
        expect(timerFraction(0)).toBe(0);
    });
});
