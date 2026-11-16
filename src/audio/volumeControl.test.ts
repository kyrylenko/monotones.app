import { createGainVolumeControl, masterGain, requestPlaybackSession, scheduleSleepFade } from './volumeControl';
import { FADE_OUT_SECONDS, fadeOutLevel } from './fadeOut';
import { FakeAudioParam } from '../test/fakeAudioParam';

// Minimal Web Audio graph recording what the volume control does; its clock is set by the test
const fakeAudioContext = () => {
    let time = 0;
    const nodes: { gain: FakeAudioParam; connect: ReturnType<typeof vi.fn> }[] = [];
    const source = { connect: vi.fn((node) => node) };
    const context = {
        state: 'suspended' as AudioContextState,
        destination: {},
        get currentTime() { return time; },
        createGain: vi.fn(() => {
            const node = { gain: new FakeAudioParam(1, () => time), connect: vi.fn((next) => next) };
            nodes.push(node);
            return node;
        }),
        resume: vi.fn(() => Promise.resolve()),
    };
    return {
        context, nodes, source,
        setTime: (seconds: number) => { time = seconds; },
        getContext: () => context as unknown as AudioContext,
    };
};

describe('volumeControl', () => {
    it('routes the source through its gain node and the master gain, created on the first play', () => {
        const { context, nodes, source, getContext } = fakeAudioContext();
        const createSource = vi.fn(() => source as unknown as AudioNode);
        const control = createGainVolumeControl(createSource, getContext);

        control.setVolume(0.4);
        expect(context.createGain).not.toHaveBeenCalled();

        control.beforePlay();

        const [gain, master] = nodes;
        expect(createSource).toHaveBeenCalledWith(context);
        expect(source.connect).toHaveBeenCalledWith(gain);
        expect(gain.connect).toHaveBeenCalledWith(master);
        expect(master.connect).toHaveBeenCalledWith(context.destination);
        expect(gain.gain.value).toBe(0.4);
        expect(context.resume).toHaveBeenCalled();
    });

    it('changes the gain afterwards and connects the source only once', () => {
        const { context, nodes, source, getContext } = fakeAudioContext();
        const createSource = vi.fn(() => source as unknown as AudioNode);
        const control = createGainVolumeControl(createSource, getContext);

        control.beforePlay();
        context.state = 'running';
        control.setVolume(0.8);
        control.beforePlay();

        expect(nodes[0].gain.value).toBe(0.8);
        expect(createSource).toHaveBeenCalledTimes(1);
        expect(context.resume).toHaveBeenCalledTimes(1);
    });

    it('shares one master gain between all sounds of a context', () => {
        const { context, getContext } = fakeAudioContext();
        const master = masterGain(getContext());
        expect(masterGain(getContext())).toBe(master);
        expect(context.createGain).toHaveBeenCalledTimes(1);
    });
});

describe('scheduleSleepFade', () => {
    // The fade runs on the audio clock, which keeps going while iOS pauses the page with the screen locked
    it('keeps full volume, then fades out along fadeOutLevel during the last seconds', () => {
        const { getContext, setTime } = fakeAudioContext();
        const master = masterGain(getContext());
        scheduleSleepFade(120, getContext());

        setTime(60);
        expect(master.gain.value).toBe(1);
        setTime(120 - FADE_OUT_SECONDS / 2);
        expect(master.gain.value).toBeCloseTo(fadeOutLevel(FADE_OUT_SECONDS / 2), 1);
        setTime(119.5);
        expect(master.gain.value).toBeLessThan(0.01);
        setTime(500);
        expect(master.gain.value).toBe(0);
    });

    it('starts inside the fade when less time is left', () => {
        const { getContext, setTime } = fakeAudioContext();
        const master = masterGain(getContext());
        scheduleSleepFade(10, getContext());

        setTime(0.02);
        expect(master.gain.value).toBeCloseTo(fadeOutLevel(10), 1);
        setTime(10.1);
        expect(master.gain.value).toBe(0);
    });

    it('comes back to full volume over a second when cancelled', () => {
        const { getContext, setTime } = fakeAudioContext();
        const master = masterGain(getContext());
        scheduleSleepFade(20, getContext());
        setTime(10);
        const faded = master.gain.value;
        expect(faded).toBeLessThan(0.5);

        scheduleSleepFade(null, getContext());
        setTime(10.5);
        expect(master.gain.value).toBeGreaterThan(faded);
        expect(master.gain.value).toBeLessThan(1);
        setTime(11);
        expect(master.gain.value).toBe(1);
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
