import { soundUrl } from '../assets';
import type { SoundId } from '../constants/soundIds';
import { createBrownNoiseBuffer } from './brownNoise';
import { createGainVolumeControl, createVolumeControl, getAudioContext } from './volumeControl';

/** One playable sound, either an mp3 file or generated in the browser */
export interface Sound {
    /** Call within the user gesture that starts playback; resolves once the sound plays */
    play(): Promise<void>;
    pause(): void;
    setVolume(volume: number): void;
    /** Sleep timer fade-out, multiplies the volume */
    setFade(level: number): void;
}

// Firefox-only global, used to detect the browser
declare const InstallTrigger: unknown;
const isFirefox = typeof InstallTrigger !== 'undefined';
// Seconds before the end to jump back to the start: avoids an audible gap where `loop` is not seamless
const LOOP_BUFFER = 0.44;

// Plays an mp3 with an invisible <audio>
export const createMediaSound = (url: string): Sound => {
    const audio = new Audio(url);
    audio.crossOrigin = 'anonymous';
    audio.loop = isFirefox;
    audio.preload = 'none';

    audio.addEventListener('timeupdate', () => {
        if (!isFirefox && audio.currentTime > audio.duration - LOOP_BUFFER) {
            audio.currentTime = 0;
            audio.play();
        }
    });

    const volume = createVolumeControl(audio);
    return {
        play() {
            volume.beforePlay();
            return audio.play();
        },
        pause() {
            if (!audio.paused) {
                audio.pause();
            }
        },
        setVolume: volume.setVolume,
        setFade: volume.setFade,
    };
};

// Loops a buffer generated with Web Audio: seamless, nothing to download, works offline
export const createGeneratedSound = (
    generate: (context: BaseAudioContext) => AudioBuffer,
    getContext: () => AudioContext = getAudioContext,
): Sound => {
    // A buffer source plays only once, so every play starts a new one into this node, which stays connected
    let input: GainNode | undefined;
    let buffer: AudioBuffer | undefined;
    let source: AudioBufferSourceNode | undefined;
    const volume = createGainVolumeControl(context => (input = context.createGain()), getContext);

    return {
        play() {
            volume.beforePlay();
            const context = getContext();
            if (!source) {
                buffer ??= generate(context);
                source = context.createBufferSource();
                source.buffer = buffer;
                source.loop = true;
                source.connect(input!);
                source.start();
            }
            // A context created outside a user gesture stays suspended until the browser allows audio
            return context.state === 'running' ? Promise.resolve() : context.resume();
        },
        pause() {
            source?.stop();
            source?.disconnect();
            source = undefined;
        },
        setVolume: volume.setVolume,
        setFade: volume.setFade,
    };
};

const generators: Partial<Record<SoundId, (context: BaseAudioContext) => AudioBuffer>> = {
    brown_noise: createBrownNoiseBuffer,
};

export const createSound = (id: SoundId): Sound => {
    const generate = generators[id];
    return generate ? createGeneratedSound(generate) : createMediaSound(soundUrl(id));
};
