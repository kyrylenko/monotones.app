import { FakeAudioParam } from './test/fakeAudioParam';
//ref: https://vitest.dev/config/#setupfiles
import '@testing-library/jest-dom/vitest';

//Tests switch to the mobile layout with window.__isMobile = true
window.matchMedia = vi.fn().mockImplementation((query: string) => {
    return {
        get matches() {
            return window.__isMobile === true;
        },
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    };
});

//jsdom cannot play media: the silent companion element of the lock screen (audio/companion.ts) only records its state
HTMLMediaElement.prototype.play = vi.fn(function (this: HTMLMediaElement) {
    Object.defineProperty(this, 'paused', { value: false, configurable: true });
    return Promise.resolve();
});
HTMLMediaElement.prototype.pause = vi.fn(function (this: HTMLMediaElement) {
    Object.defineProperty(this, 'paused', { value: true, configurable: true });
});

//jsdom has no canvas: the sky is not drawn
HTMLCanvasElement.prototype.getContext = () => null;

//jsdom has no Web Audio and cannot fetch or decode mp3 files: record which sounds play and how loud.
//The audio clock follows Date.now(), so tests that fake Date also move scheduled volume changes (the sleep timer fade).
const audioClock = () => Date.now() / 1000;
class FakeNode {
    next?: FakeNode;
    gain?: { value: number };
    connect(next: FakeNode) {
        this.next = next;
        return next;
    }
    disconnect() { }
}

class FakeBufferSource extends FakeNode {
    buffer?: { url?: string };
    loop = false;
    loopStart = 0;
    loopEnd = 0;
    start() { window.__playing.add(this); }
    stop() { window.__playing.delete(this); }
    /** What reaches the speakers: the product of the gains on the way */
    get volume() {
        let volume = 1;
        for (let node = this.next; node; node = node.next) {
            volume *= node.gain?.value ?? 1;
        }
        return volume;
    }
}

const fakeAudioBuffer = (channels: number, length: number, sampleRate: number, value = 0) => {
    const data = Array.from({ length: channels }, () => new Float32Array(length).fill(value));
    return { numberOfChannels: channels, length, sampleRate, duration: length / sampleRate, getChannelData: (i: number) => data[i] };
};

class FakeAudioContext {
    state = 'running';
    sampleRate = 1000;
    destination = new FakeNode();
    resume = () => Promise.resolve();
    get currentTime() { return audioClock(); }
    createGain = () => Object.assign(new FakeNode(), { gain: new FakeAudioParam(1, audioClock) });
    createBufferSource = () => new FakeBufferSource();
    createBuffer = (channels: number, length: number, sampleRate: number) => fakeAudioBuffer(channels, length, sampleRate);
    // Decoded files remember their url, so tests can tell which sound plays
    decodeAudioData = (data: ArrayBuffer & { url?: string }) =>
        Promise.resolve({ ...fakeAudioBuffer(2, 1000, this.sampleRate, 0.5), url: data.url });
}

window.AudioContext = FakeAudioContext as unknown as typeof AudioContext;
globalThis.fetch = vi.fn((url: string) => Promise.resolve({
    ok: true,
    arrayBuffer: () => Promise.resolve(Object.assign(new ArrayBuffer(8), { url })),
})) as unknown as typeof fetch;
window.__playing = new Set();

beforeEach(() => {
    window.__isMobile = false;
    window.__playing.clear();
    localStorage.clear();
});
