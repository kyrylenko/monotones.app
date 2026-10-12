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
    });
});
