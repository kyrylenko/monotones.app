import { createGainVolumeControl, requestPlaybackSession } from './volumeControl';

// Minimal Web Audio graph recording what the volume control does
const fakeAudioContext = () => {
    const gain = { gain: { value: 1 }, connect: vi.fn((node) => node) };
    const source = { connect: vi.fn(() => gain) };
    const context = {
        state: 'suspended' as AudioContextState,
        destination: {},
        createGain: vi.fn(() => gain),
        resume: vi.fn(() => Promise.resolve()),
    };
    return { context, gain, source, getContext: () => context as unknown as AudioContext };
};

describe('volumeControl', () => {
    afterEach(() => vi.useRealTimers());

    it('routes the source through a gain node created on the first play', () => {
        const { context, gain, source, getContext } = fakeAudioContext();
        const createSource = vi.fn(() => source as unknown as AudioNode);
        const control = createGainVolumeControl(createSource, getContext);

        control.setVolume(0.4);
        expect(context.createGain).not.toHaveBeenCalled();

        control.beforePlay();

        expect(createSource).toHaveBeenCalledWith(context);
        expect(source.connect).toHaveBeenCalledWith(gain);
        expect(gain.connect).toHaveBeenCalledWith(context.destination);
        expect(gain.gain.value).toBe(0.4);
        expect(context.resume).toHaveBeenCalled();
    });

    it('changes the gain afterwards and connects the source only once', () => {
        const { context, gain, source, getContext } = fakeAudioContext();
        const createSource = vi.fn(() => source as unknown as AudioNode);
        const control = createGainVolumeControl(createSource, getContext);

        control.beforePlay();
        context.state = 'running';
        control.setVolume(0.8);
        control.beforePlay();

        expect(gain.gain.value).toBe(0.8);
        expect(createSource).toHaveBeenCalledTimes(1);
        expect(context.resume).toHaveBeenCalledTimes(1);
    });

    describe('fade', () => {
        beforeEach(() => vi.useFakeTimers());

        const playingAt = (volume: number) => {
            const { gain, source, getContext } = fakeAudioContext();
            const control = createGainVolumeControl(() => source as unknown as AudioNode, getContext);
            control.setVolume(volume);
            control.beforePlay();
            return { gain: gain.gain, control };
        };

        it('ramps the volume smoothly to the new level over a second', () => {
            const { gain, control } = playingAt(0.8);

            control.setFade(0.5);
            expect(gain.value).toBe(0.8);

            vi.advanceTimersByTime(500);
            expect(gain.value).toBeCloseTo(0.6);

            vi.advanceTimersByTime(500);
            expect(gain.value).toBeCloseTo(0.4);

            vi.advanceTimersByTime(5000);
            expect(gain.value).toBeCloseTo(0.4);
        });

        it('fades out to silence step by step', () => {
            const { gain, control } = playingAt(1);

            for (const level of [0.75, 0.5, 0.25, 0]) {
                control.setFade(level);
                vi.advanceTimersByTime(1000);
                expect(gain.value).toBeCloseTo(level);
            }
            expect(gain.value).toBe(0);
        });

        it('continues from the current level when the target changes mid-ramp', () => {
            const { gain, control } = playingAt(1);

            control.setFade(0);
            vi.advanceTimersByTime(500);
            control.setFade(1);
            vi.advanceTimersByTime(500);

            expect(gain.value).toBeCloseTo(0.75);
            vi.advanceTimersByTime(500);
            expect(gain.value).toBe(1);
        });

        it('restores the full volume when the fade is cancelled', () => {
            const { gain, control } = playingAt(0.3);

            control.setFade(0.1);
            vi.advanceTimersByTime(1000);
            control.setFade(1);
            vi.advanceTimersByTime(1000);

            expect(gain.value).toBe(0.3);
        });

        it('keeps volume changes during the fade', () => {
            const { gain, control } = playingAt(0.8);

            control.setFade(0.5);
            vi.advanceTimersByTime(1000);
            control.setVolume(0.6);

            expect(gain.value).toBeCloseTo(0.3);
        });
    });
});

describe('requestPlaybackSession', () => {
    afterEach(() => {
        delete (navigator as { audioSession?: unknown }).audioSession;
    });

    it('asks Safari for media playback, which keeps playing with the screen locked', () => {
        const audioSession = { type: 'auto' };
        Object.defineProperty(navigator, 'audioSession', { value: audioSession, configurable: true });

        requestPlaybackSession();

        expect(audioSession.type).toBe('playback');
    });

    it('does nothing in browsers without the Audio Session API', () => {
        expect(() => requestPlaybackSession()).not.toThrow();
    });
});
