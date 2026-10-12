import { createBrownNoiseBuffer, fillBrownNoise } from './brownNoise';

// Deterministic random numbers in [0, 1)
const seededRandom = (seed = 1) => () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
};

const generate = (length = 48000) => {
    const data = new Float32Array(length);
    fillBrownNoise(data, seededRandom());
    return data;
};

describe('fillBrownNoise', () => {
    it('stays within the peak and is centered around zero', () => {
        const data = generate();
        const peak = Math.max(...data.map(Math.abs));
        const mean = data.reduce((sum, x) => sum + x, 0) / data.length;

        expect(peak).toBeCloseTo(0.9);
        expect(Math.abs(mean)).toBeLessThan(1e-6);
    });

    it('loops without a click: the jump from the last to the first sample is like any other step', () => {
        const data = generate();
        const steps = data.slice(1).map((x, i) => Math.abs(x - data[i]));
        const largestStep = Math.max(...steps);

        expect(Math.abs(data[0] - data[data.length - 1])).toBeLessThanOrEqual(largestStep);
    });

    it('is brown: neighbouring samples change slowly, unlike white noise', () => {
        const data = generate();
        const meanStep = data.slice(1).reduce((sum, x, i) => sum + Math.abs(x - data[i]), 0) / (data.length - 1);

        expect(meanStep).toBeLessThan(0.05);
    });
});

describe('createBrownNoiseBuffer', () => {
    it('fills a stereo loop with different noise per channel', () => {
        const channels = [new Float32Array(10), new Float32Array(10)];
        const buffer = { numberOfChannels: 2, getChannelData: (i: number) => channels[i] };
        const context = { sampleRate: 44100, createBuffer: vi.fn(() => buffer) };

        expect(createBrownNoiseBuffer(context as unknown as BaseAudioContext)).toBe(buffer);

        expect(context.createBuffer).toHaveBeenCalledWith(2, 8 * 44100, 44100);
        expect(channels[0].some(x => x !== 0)).toBe(true);
        expect(channels[0]).not.toEqual(channels[1]);
    });
});
