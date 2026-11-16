import { pauseCompanion, playCompanion, setCompanionPlayingHandler } from './companion';

// The element is created by the first play; the fake play() of setupTests records it as its `this`
const companion = () => vi.mocked(HTMLMediaElement.prototype.play).mock.contexts.at(-1) as HTMLAudioElement;

describe('companion', () => {
    it('loops a generated silent WAV long enough for Android media notifications (5 s and more)', () => {
        playCompanion();
        const element = companion();

        expect(element.loop).toBe(true);
        expect(element.src).toMatch(/^data:audio\/wav;base64,/);
        const bytes = Uint8Array.from(atob(element.src.split(',')[1]), char => char.charCodeAt(0));
        const view = new DataView(bytes.buffer);
        const sampleRate = view.getUint32(24, true);
        const dataBytes = view.getUint32(40, true);
        expect(dataBytes / sampleRate).toBeGreaterThanOrEqual(5);
        expect(bytes.subarray(44).every(sample => sample === 128)).toBe(true);
    });

    it('pauses, plays again with the same element and reports when it really plays', () => {
        const onPlaying = vi.fn();
        setCompanionPlayingHandler(onPlaying);
        playCompanion();
        const element = companion();

        pauseCompanion();
        expect(element.paused).toBe(true);
        playCompanion();
        expect(companion()).toBe(element);

        element.dispatchEvent(new Event('playing'));
        expect(onPlaying).toHaveBeenCalledTimes(1);
        setCompanionPlayingHandler(undefined);
    });
});
