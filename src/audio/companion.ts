// A looping, silent <audio> element that plays along with the Web Audio sounds.
// iOS Safari shows the Media Session title and artwork on the lock screen only for a playing media element,
// not for Web Audio alone; this element gives it one. It is generated, so it works offline and costs nothing to load.

// Half a second of 8-bit mono silence at 8 kHz as a WAV file (8-bit samples are unsigned: 128 is silence)
const silentWav = (): string => {
    const sampleRate = 8000;
    const samples = sampleRate / 2;
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
    return `data:audio/wav;base64,${btoa(String.fromCharCode(...bytes))}`;
};

let element: HTMLAudioElement | undefined;

/** Call within the user gesture that starts playback (iOS) */
export const playCompanion = () => {
    if (!element) {
        element = new Audio(silentWav());
        element.loop = true;
    }
    // Rejected when the browser refuses media playback: the sounds still play, only the lock screen info is missing
    void element.play()?.catch(() => undefined);
};

export const pauseCompanion = () => {
    element?.pause();
};
