import { createGeneratedSound } from './sound';

// Minimal Web Audio graph recording what the generated sound does
const fakeAudioContext = () => {
    const gain = { gain: { value: 1 }, connect: vi.fn((node) => node) };
    const input = { connect: vi.fn(() => gain) };
    const sources: { buffer?: unknown; loop: boolean; connect: ReturnType<typeof vi.fn>; start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }[] = [];
    const context = {
        state: 'suspended' as AudioContextState,
        destination: {},
        // The volume gain is created first, then the input node in front of it
        createGain: vi.fn()
            .mockReturnValueOnce(gain)
            .mockReturnValueOnce(input),
        createBufferSource: vi.fn(() => {
            const source = { loop: false, connect: vi.fn(), start: vi.fn(), stop: vi.fn(), disconnect: vi.fn() };
            sources.push(source);
            return source;
        }),
        resume: vi.fn(() => Promise.resolve()),
    };
    return { context, gain, input, sources, getContext: () => context as unknown as AudioContext };
};

describe('createGeneratedSound', () => {
    const buffer = {} as AudioBuffer;

    it('touches Web Audio only on the first play', () => {
        const { context, getContext } = fakeAudioContext();
        const generate = vi.fn(() => buffer);

        const sound = createGeneratedSound(generate, getContext);
        sound.setVolume(0.4);
        sound.pause();

        expect(generate).not.toHaveBeenCalled();
        expect(context.createGain).not.toHaveBeenCalled();
    });

    it('loops the generated buffer through the volume gain', async () => {
        const { context, gain, input, sources, getContext } = fakeAudioContext();
        const sound = createGeneratedSound(() => buffer, getContext);
        sound.setVolume(0.4);

        await sound.play();

        expect(sources).toHaveLength(1);
        expect(sources[0]).toMatchObject({ buffer, loop: true });
        expect(sources[0].connect).toHaveBeenCalledWith(input);
        expect(sources[0].start).toHaveBeenCalled();
        expect(input.connect).toHaveBeenCalledWith(gain);
        expect(gain.connect).toHaveBeenCalledWith(context.destination);
        expect(gain.gain.value).toBe(0.4);
        expect(context.resume).toHaveBeenCalled();
    });

    it('stops on pause and starts a new source on the next play, generating the buffer once', async () => {
        const { context, sources, getContext } = fakeAudioContext();
        const generate = vi.fn(() => buffer);
        const sound = createGeneratedSound(generate, getContext);

        await sound.play();
        context.state = 'running';
        await sound.play();
        expect(sources).toHaveLength(1);

        sound.pause();
        expect(sources[0].stop).toHaveBeenCalled();
        expect(sources[0].disconnect).toHaveBeenCalled();

        await sound.play();
        expect(sources).toHaveLength(2);
        expect(generate).toHaveBeenCalledTimes(1);
        expect(context.createGain).toHaveBeenCalledTimes(2);
    });

    it('fades the volume for the sleep timer', () => {
        vi.useFakeTimers();
        const { gain, getContext } = fakeAudioContext();
        const sound = createGeneratedSound(() => buffer, getContext);
        sound.setVolume(0.8);
        void sound.play();

        sound.setFade(0.5);
        vi.advanceTimersByTime(1000);

        expect(gain.gain.value).toBeCloseTo(0.4);
        vi.useRealTimers();
    });
});
