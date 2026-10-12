export interface VolumeControl {
    setVolume(volume: number): void;
    /** Multiplies the volume (0-1) without changing it, ramping smoothly to the new level */
    setFade(level: number): void;
    /** Call right before audio.play(), within the user gesture that starts playback */
    beforePlay(): void;
}

// Where the resulting volume goes: the element itself or a Web Audio gain node
interface VolumeOutput {
    apply(volume: number): void;
    beforePlay(): void;
}

// Fade changes arrive once per second (sleep timer ticks), each one is ramped over that second in small steps
const FADE_RAMP_MS = 1000;
const FADE_STEP_MS = 50;

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

const elementOutput = (audio: HTMLAudioElement): VolumeOutput => ({
    apply: (volume) => { audio.volume = volume; },
    beforePlay: () => {},
});

// Routes the element through a Web Audio gain node, which controls the volume instead
const gainOutput = (audio: HTMLAudioElement, getContext: () => AudioContext): VolumeOutput => {
    let gain: GainNode | undefined;
    let volume = 1;

    return {
        apply(value) {
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
): VolumeControl => {
    const output = useElementVolume ? elementOutput(audio) : gainOutput(audio, getContext);
    let volume = 1;
    let fade = 1;
    let ramp: ReturnType<typeof setInterval> | undefined;

    const apply = () => output.apply(volume * fade);

    return {
        setVolume(value) {
            volume = value;
            apply();
        },
        setFade(level) {
            clearInterval(ramp);
            ramp = undefined;
            if (level === fade) {
                return;
            }
            const from = fade;
            const steps = FADE_RAMP_MS / FADE_STEP_MS;
            let step = 0;
            ramp = setInterval(() => {
                step++;
                // The last step sets the level exactly: audio.volume throws above 1
                fade = step < steps ? from + (level - from) * step / steps : level;
                apply();
                if (step >= steps) {
                    clearInterval(ramp);
                    ramp = undefined;
                }
            }, FADE_STEP_MS);
        },
        beforePlay: () => output.beforePlay(),
    };
};
