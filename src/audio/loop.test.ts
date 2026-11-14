import { prepareLoop, wholeLoop } from './loop';

// AudioBuffer stand-in: jsdom has no Web Audio
const fakeBuffer = (channels: number[][], sampleRate = 1000) => {
    const data = channels.map(c => Float32Array.from(c));
    return {
        numberOfChannels: data.length,
        length: data[0].length,
        sampleRate,
        duration: data[0].length / sampleRate,
        getChannelData: (i: number) => data[i],
    } as unknown as AudioBuffer;
};

// 1000 Hz sample rate: the 50 ms crossfade is 50 samples
const tone = (length: number, value: (i: number) => number) => Array.from({ length }, (_, i) => value(i));

describe('prepareLoop', () => {
    it('skips the silence at both ends', () => {
        const samples = [...tone(40, () => 0), ...tone(500, () => 0.5), ...tone(20, () => 0.00001)];
        const loop = prepareLoop(fakeBuffer([samples, samples]));

        expect(loop.start).toBe(0.04);
        expect(loop.loopStart).toBe(0.09);
        expect(loop.loopEnd).toBe(0.54);
    });

    it('treats a sample as sound when any channel has sound', () => {
        const left = [0, 0, ...tone(200, () => 0.3), 0];
        const right = [0, 0.2, ...tone(200, () => 0.3), 0.2];
        const loop = prepareLoop(fakeBuffer([left, right]));

        expect(loop.start).toBe(0.001);
        expect(loop.loopEnd).toBe(0.203);
    });

    it('fades the end into the start, so the jump back has no click', () => {
        // A ramp: without the crossfade the loop would jump from 0.999 back to 0
        const samples = tone(1000, i => i / 1000);
        const loop = prepareLoop(fakeBuffer([samples]));
        const data = loop.buffer.getChannelData(0);
        const end = Math.round(loop.loopEnd * 1000);
        const restart = Math.round(loop.loopStart * 1000);

        // The last sample before the jump is close to the sample played right after it
        expect(Math.abs(data[end - 1] - data[restart])).toBeLessThan(0.01);
        // The crossfade starts from the original end, without a jump either
        expect(data[end - 51]).toBeCloseTo(0.949);
        expect(Math.abs(data[end - 50] - data[end - 51])).toBeLessThan(0.02);
        // The head is untouched for the first play
        expect(data[0]).toBe(0);
        expect(data[10]).toBeCloseTo(0.01);
    });

    it('keeps the loudness through the crossfade (equal power)', () => {
        // Loud end, nearly silent start: halfway the end is still at ~0.7 (a linear crossfade gives 0.5)
        const samples = [...tone(50, () => 0.001), ...tone(950, () => 1)];
        const data = prepareLoop(fakeBuffer([samples])).buffer.getChannelData(0);

        expect(data[975]).toBeGreaterThan(0.65);
        expect(data[975]).toBeLessThan(0.75);
    });

    it('handles a silent buffer', () => {
        const loop = prepareLoop(fakeBuffer([tone(100, () => 0)]));
        expect(loop.loopStart).toBe(loop.loopEnd);
    });
});

describe('wholeLoop', () => {
    it('loops the whole buffer from the start', () => {
        const buffer = fakeBuffer([tone(800, () => 0.1)]);
        expect(wholeLoop(buffer)).toEqual({ buffer, start: 0, loopStart: 0, loopEnd: 0.8 });
    });
});
