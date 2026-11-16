// A looping, silent <audio> element that plays along with the Web Audio sounds.
// Browsers show media controls on the lock screen and in the notifications only for a playing media element,
// not for Web Audio alone; this element gives them one. It is generated, so it works offline and costs nothing to load.
// Chrome on Android shows them only for media of at least 5 seconds: https://developer.chrome.com/blog/media-notifications
const SECONDS = 10;

// 8-bit mono silence at 8 kHz as a WAV file (8-bit samples are unsigned: 128 is silence)
const silentWav = (): string => {
    const sampleRate = 8000;
    const samples = sampleRate * SECONDS;
    const bytes = new Uint8Array(44 + samples);
    const view = new DataView(bytes.buffer);
    const text = (offset: number, value: string) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
    text(0, 'RIFF');
    view.setUint32(4, 36 + samples, true);
    text(8, 'WAVE');
    text(12, 'fmt ');
    view.setUint32(16, 16, true); // format chunk size
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate, true); // bytes per second
    view.setUint16(32, 1, true); // bytes per sample frame
    view.setUint16(34, 8, true); // bits per sample
    text(36, 'data');
    view.setUint32(40, samples, true);
    bytes.fill(128, 44);
    // In chunks: Safari limits how many arguments a function call can take
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    }
    return `data:audio/wav;base64,${btoa(binary)}`;
};

let element: HTMLAudioElement | undefined;
let onPlaying: (() => void) | undefined;

/** Called each time the element starts playing: iOS takes the lock screen info set from then on */
export const setCompanionPlayingHandler = (handler: (() => void) | undefined) => {
    onPlaying = handler;
};

/** Call within the user gesture that starts playback (iOS) */
export const playCompanion = () => {
    if (!element) {
        element = new Audio(silentWav());
        element.loop = true;
        element.addEventListener('playing', () => onPlaying?.());
    }
    // Rejected when the browser refuses media playback: the sounds still play, only the lock screen info is missing
    void element.play()?.catch(() => undefined);
};

export const pauseCompanion = () => {
    element?.pause();
};
