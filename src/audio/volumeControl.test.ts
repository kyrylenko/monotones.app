import { createVolumeControl, supportsElementVolume } from './volumeControl';

// Minimal Web Audio graph recording what the volume control does
const fakeAudioContext = () => {
    const gain = { gain: { value: 1 }, connect: vi.fn((node) => node) };
    const source = { connect: vi.fn(() => gain) };
    const context = {
        state: 'suspended' as AudioContextState,
        destination: {},
        createGain: vi.fn(() => gain),
        createMediaElementSource: vi.fn(() => source),
        resume: vi.fn(() => Promise.resolve()),
    };
    return { context, gain, source, getContext: () => context as unknown as AudioContext };
};

describe('volumeControl', () => {
    afterEach(() => vi.useRealTimers());

    it('detects that the browser supports element volume (desktop browsers, jsdom)', () => {
        expect(supportsElementVolume()).toBe(true);
    });

    it('sets the element volume where it is supported', () => {
        const audio = new Audio();
        const control = createVolumeControl(audio, { useElementVolume: true });

        control.setVolume(0.4);
        control.beforePlay();

        expect(audio.volume).toBe(0.4);
    });

    describe('without element volume (iOS Safari)', () => {
        it('routes the audio through a gain node created on the first play', () => {
            const audio = new Audio();
            const { context, gain, source, getContext } = fakeAudioContext();
            const control = createVolumeControl(audio, { useElementVolume: false, getContext });

            control.setVolume(0.4);
            expect(context.createGain).not.toHaveBeenCalled();

            control.beforePlay();

            expect(context.createMediaElementSource).toHaveBeenCalledWith(audio);
            expect(source.connect).toHaveBeenCalledWith(gain);
            expect(gain.connect).toHaveBeenCalledWith(context.destination);
            expect(gain.gain.value).toBe(0.4);
            expect(context.resume).toHaveBeenCalled();
        });

        it('changes the gain afterwards and connects the element only once', () => {
            const audio = new Audio();
            const { context, gain, getContext } = fakeAudioContext();
            const control = createVolumeControl(audio, { useElementVolume: false, getContext });

            control.beforePlay();
            context.state = 'running';
            control.setVolume(0.8);
            control.beforePlay();

            expect(gain.gain.value).toBe(0.8);
            expect(context.createMediaElementSource).toHaveBeenCalledTimes(1);
            expect(context.resume).toHaveBeenCalledTimes(1);
        });

        it('fades the gain without changing the volume', () => {
            vi.useFakeTimers();
            const { gain, getContext } = fakeAudioContext();
            const control = createVolumeControl(new Audio(), { useElementVolume: false, getContext });
            control.setVolume(0.4);
            control.beforePlay();

            control.setFade(0.5);
            vi.advanceTimersByTime(1000);
            expect(gain.gain.value).toBeCloseTo(0.2);

            control.setVolume(0.8);
            expect(gain.gain.value).toBeCloseTo(0.4);
        });
    });

    describe('fade', () => {
        beforeEach(() => vi.useFakeTimers());

        const playingAt = (volume: number) => {
            const audio = new Audio();
            const control = createVolumeControl(audio, { useElementVolume: true });
            control.setVolume(volume);
            return { audio, control };
        };

        it('ramps the volume smoothly to the new level over a second', () => {
            const { audio, control } = playingAt(0.8);

            control.setFade(0.5);
            expect(audio.volume).toBe(0.8);

            vi.advanceTimersByTime(500);
            expect(audio.volume).toBeCloseTo(0.6);

            vi.advanceTimersByTime(500);
            expect(audio.volume).toBeCloseTo(0.4);

            vi.advanceTimersByTime(5000);
            expect(audio.volume).toBeCloseTo(0.4);
        });

        it('fades out to silence step by step', () => {
            const { audio, control } = playingAt(1);

            for (const level of [0.75, 0.5, 0.25, 0]) {
                control.setFade(level);
                vi.advanceTimersByTime(1000);
                expect(audio.volume).toBeCloseTo(level);
            }
            expect(audio.volume).toBe(0);
        });

        it('continues from the current level when the target changes mid-ramp', () => {
            const { audio, control } = playingAt(1);

            control.setFade(0);
            vi.advanceTimersByTime(500);
            control.setFade(1);
            vi.advanceTimersByTime(500);

            expect(audio.volume).toBeCloseTo(0.75);
            vi.advanceTimersByTime(500);
            expect(audio.volume).toBe(1);
        });

        it('restores the full volume when the fade is cancelled', () => {
            const { audio, control } = playingAt(0.3);

            control.setFade(0.1);
            vi.advanceTimersByTime(1000);
            control.setFade(1);
            vi.advanceTimersByTime(1000);

            expect(audio.volume).toBe(0.3);
        });

        it('keeps volume changes during the fade', () => {
            const { audio, control } = playingAt(0.8);

            control.setFade(0.5);
            vi.advanceTimersByTime(1000);
            control.setVolume(0.6);

            expect(audio.volume).toBeCloseTo(0.3);
        });
    });
});
