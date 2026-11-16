import { createLoopSound } from './sound';
import { masterGain } from './volumeControl';
import type { Loop } from './loop';

interface FakeSource {
    buffer?: unknown;
    loop: boolean;
    loopStart: number;
    loopEnd: number;
    connect: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
}

// Minimal Web Audio graph recording what the sound does
const fakeAudioContext = () => {
    const gain = { gain: { value: 1 }, connect: vi.fn((node) => node) };
    const input = { connect: vi.fn(() => gain) };
    const sources: FakeSource[] = [];
    const context = {
        state: 'suspended' as AudioContextState,
        destination: {},
        // The volume gain is created first, then the input node in front of it
        // then the master gain shared by all sounds
        createGain: vi.fn()
            .mockReturnValueOnce(gain)
            .mockReturnValueOnce(input)
            .mockReturnValue({ gain: { value: 1 }, connect: vi.fn() }),
        createBufferSource: vi.fn(() => {
            const source = { loop: false, loopStart: 0, loopEnd: 0, connect: vi.fn(), start: vi.fn(), stop: vi.fn(), disconnect: vi.fn() };
            sources.push(source);
            return source;
        }),
        resume: vi.fn(() => Promise.resolve()),
    };
    return { context, gain, input, sources, getContext: () => context as unknown as AudioContext };
};

const loop: Loop = { buffer: {} as AudioBuffer, start: 0.04, loopStart: 0.09, loopEnd: 30 };

describe('createLoopSound', () => {
    afterEach(() => vi.useRealTimers());

    it('touches Web Audio only on the first play', () => {
        const { context, getContext } = fakeAudioContext();
        const load = vi.fn(() => Promise.resolve(loop));

        const sound = createLoopSound(load, { getContext });
        sound.setVolume(0.4);
        sound.pause();

        expect(load).not.toHaveBeenCalled();
        expect(context.createGain).not.toHaveBeenCalled();
    });

    it('loops the loaded buffer from its start through the volume gain', async () => {
        const { context, gain, input, sources, getContext } = fakeAudioContext();
        const sound = createLoopSound(() => Promise.resolve(loop), { getContext });
        sound.setVolume(0.4);

        await sound.play();

        expect(sources).toHaveLength(1);
        expect(sources[0]).toMatchObject({ buffer: loop.buffer, loop: true, loopStart: 0.09, loopEnd: 30 });
        expect(sources[0].start).toHaveBeenCalledWith(0, 0.04);
        expect(sources[0].connect).toHaveBeenCalledWith(input);
        expect(input.connect).toHaveBeenCalledWith(gain);
        expect(gain.connect).toHaveBeenCalledWith(masterGain(getContext()));
        expect(gain.gain.value).toBe(0.4);
        expect(context.resume).toHaveBeenCalled();
    });

    it('stops on pause and starts a new source on the next play, loading once', async () => {
        const { context, sources, getContext } = fakeAudioContext();
        const load = vi.fn(() => Promise.resolve(loop));
        const sound = createLoopSound(load, { getContext });

        await sound.play();
        context.state = 'running';
        await sound.play();
        expect(sources).toHaveLength(1);

        sound.pause();
        expect(sources[0].stop).toHaveBeenCalled();
        expect(sources[0].disconnect).toHaveBeenCalled();

        await sound.play();
        expect(sources).toHaveLength(2);
        expect(load).toHaveBeenCalledTimes(1);
        // the volume gain, the input node and the master gain, created once
        expect(context.createGain).toHaveBeenCalledTimes(3);
    });

    it('releases the loop on pause and loads it again, to keep memory low', async () => {
        const { getContext } = fakeAudioContext();
        const load = vi.fn(() => Promise.resolve(loop));
        const sound = createLoopSound(load, { release: true, getContext });

        await sound.play();
        sound.pause();
        await sound.play();

        expect(load).toHaveBeenCalledTimes(2);
    });

    it('does not start when paused while loading, and starts once when played again', async () => {
        const { sources, getContext } = fakeAudioContext();
        let finish!: (value: Loop) => void;
        const load = vi.fn(() => new Promise<Loop>(resolve => { finish = resolve; }));
        const sound = createLoopSound(load, { getContext });

        const first = sound.play();
        sound.pause();
        finish(loop);
        await first;
        expect(sources).toHaveLength(0);

        await Promise.all([sound.play(), sound.play()]);
        expect(sources).toHaveLength(1);
        expect(load).toHaveBeenCalledTimes(1);
    });

    it('tries to load again after a failure (e.g. offline before the file was cached)', async () => {
        const { sources, getContext } = fakeAudioContext();
        const load = vi.fn()
            .mockRejectedValueOnce(new Error('offline'))
            .mockResolvedValueOnce(loop);
        const sound = createLoopSound(load, { getContext });

        await expect(sound.play()).rejects.toThrow('offline');
        await sound.play();

        expect(sources).toHaveLength(1);
    });
});
