import { FADE_OUT_SECONDS, fadeOutLevel } from './fadeOut';

export interface VolumeControl {
    setVolume(volume: number): void;
    /** Call right before playback starts, within the user gesture that starts it */
    beforePlay(): void;
}

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
/** Whether any sound has played yet (the context is created on the first play) */
export const hasAudioContext = () => sharedContext !== undefined;

export const getAudioContext = (): AudioContext => {
    if (!sharedContext) {
        requestPlaybackSession();
        sharedContext = new AudioContext();
    }
    return sharedContext;
};

// Every sound of a context goes through one master gain to the speakers: the sleep timer fades it out
const masters = new WeakMap<BaseAudioContext, GainNode>();
export const masterGain = (context: BaseAudioContext): GainNode => {
    let master = masters.get(context);
    if (!master) {
        master = context.createGain();
        master.connect(context.destination);
        masters.set(context, master);
    }
    return master;
};

// Values per second in the fade curve: smooth enough to sound continuous
const CURVE_RATE = 20;
// A cancelled fade comes back to full volume over this time instead of jumping
const RESTORE_SECONDS = 1;

// Schedules the sleep timer fade on the audio thread, so it happens on time even with the screen locked,
// when iOS pauses the page's timers but keeps the audio running. null cancels the fade (back to full volume).
export const scheduleSleepFade = (secondsLeft: number | null, context: BaseAudioContext = getAudioContext()) => {
    const gain = masterGain(context).gain;
    const now = context.currentTime;
    const current = gain.value;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(current, now);

    if (secondsLeft === null) {
        gain.linearRampToValueAtTime(1, now + RESTORE_SECONDS);
        return;
    }
    // Full volume until the last FADE_OUT_SECONDS, then the curve of fadeOutLevel down to silence
    const fadeSeconds = Math.max(0, Math.min(secondsLeft, FADE_OUT_SECONDS));
    const fadeStart = now + secondsLeft - fadeSeconds;
    if (fadeStart > now) {
        gain.linearRampToValueAtTime(1, Math.min(fadeStart, now + RESTORE_SECONDS));
    }
    if (fadeSeconds > 0) {
        const steps = Math.max(2, Math.ceil(fadeSeconds * CURVE_RATE));
        const curve = Float32Array.from({ length: steps }, (_, i) => fadeOutLevel(fadeSeconds * (1 - i / (steps - 1))));
        gain.setValueCurveAtTime(curve, Math.max(fadeStart, now + 0.01), fadeSeconds);
    } else {
        gain.setValueAtTime(0, now);
    }
};

/** Volume of a sound played with Web Audio; createSource is called once, on the first play */
export const createGainVolumeControl = (
    createSource: (context: AudioContext) => AudioNode,
    getContext: () => AudioContext = getAudioContext,
): VolumeControl => {
    let gain: GainNode | undefined;
    let volume = 1;

    return {
        setVolume(value) {
            volume = value;
            if (gain) {
                gain.gain.value = volume;
            }
        },
        beforePlay() {
            const context = getContext();
            if (!gain) {
                gain = context.createGain();
                gain.gain.value = volume;
                createSource(context).connect(gain).connect(masterGain(context));
            }
            if (context.state !== 'running') {
                void context.resume();
            }
        },
    };
};
