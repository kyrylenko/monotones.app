export interface VolumeControl {
    setVolume(volume: number): void;
    /** Multiplies the volume (0-1) without changing it, ramping smoothly to the new level */
    setFade(level: number): void;
    /** Call right before playback starts, within the user gesture that starts it */
    beforePlay(): void;
}

// Fade changes arrive once per second (sleep timer ticks), each one is ramped over that second in small steps
const FADE_RAMP_MS = 1000;
const FADE_STEP_MS = 50;

// Safari plays Web Audio as "ambient" sound by default, which iOS stops when the screen locks.
// The "playback" type of the Audio Session API (Safari only) makes it media playback: it goes on with the screen locked,
// ignores the silent switch and pauses other apps' audio, like a music app.
// https://developer.mozilla.org/docs/Web/API/AudioSession/type
export const requestPlaybackSession = () => {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) {
        session.type = 'playback';
    }
};

// One context for all sounds; created on the first play because iOS only allows it in a user gesture
let sharedContext: AudioContext | undefined;
export const getAudioContext = (): AudioContext => {
    if (!sharedContext) {
        requestPlaybackSession();
        sharedContext = new AudioContext();
    }
    return sharedContext;
};

/** Volume of a sound played with Web Audio; createSource is called once, on the first play */
export const createGainVolumeControl = (
    createSource: (context: AudioContext) => AudioNode,
    getContext: () => AudioContext = getAudioContext,
): VolumeControl => {
    let gain: GainNode | undefined;
    let volume = 1;
    let fade = 1;
    let ramp: ReturnType<typeof setInterval> | undefined;

    const apply = () => {
        if (gain) {
            gain.gain.value = volume * fade;
        }
    };

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
                fade = step < steps ? from + (level - from) * step / steps : level;
                apply();
                if (step >= steps) {
                    clearInterval(ramp);
                    ramp = undefined;
                }
            }, FADE_STEP_MS);
        },
        beforePlay() {
            const context = getContext();
            if (!gain) {
                gain = context.createGain();
                apply();
                createSource(context).connect(gain).connect(context.destination);
            }
            if (context.state !== 'running') {
                void context.resume();
            }
        },
    };
};
