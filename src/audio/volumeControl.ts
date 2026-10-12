export interface VolumeControl {
    setVolume(volume: number): void;
    /** Call right before audio.play(), within the user gesture that starts playback */
    beforePlay(): void;
}

// iOS Safari ignores HTMLMediaElement.volume (it always stays 1)
let elementVolumeSupported: boolean | undefined;
export const supportsElementVolume = (): boolean => {
    if (elementVolumeSupported === undefined) {
        const probe = new Audio();
        probe.volume = 0.5;
        elementVolumeSupported = probe.volume === 0.5;
    }
    return elementVolumeSupported;
};

// One context for all sounds; created on the first play because iOS only allows it in a user gesture
let sharedContext: AudioContext | undefined;
const getAudioContext = (): AudioContext => (sharedContext ??= new AudioContext());

const elementVolume = (audio: HTMLAudioElement): VolumeControl => ({
    setVolume: (volume) => { audio.volume = volume; },
    beforePlay: () => {},
});

// Routes the element through a Web Audio gain node, which controls the volume instead
const gainVolume = (audio: HTMLAudioElement, getContext: () => AudioContext): VolumeControl => {
    let gain: GainNode | undefined;
    let volume = 1;

    return {
        setVolume(value) {
            volume = value;
            if (gain) {
                gain.gain.value = value;
            }
        },
        beforePlay() {
            const context = getContext();
            if (!gain) {
                gain = context.createGain();
                gain.gain.value = volume;
                context.createMediaElementSource(audio).connect(gain).connect(context.destination);
            }
            if (context.state !== 'running') {
                void context.resume();
            }
        },
    };
};

export const createVolumeControl = (
    audio: HTMLAudioElement,
    { useElementVolume = supportsElementVolume(), getContext = getAudioContext } = {},
): VolumeControl => useElementVolume ? elementVolume(audio) : gainVolume(audio, getContext);
