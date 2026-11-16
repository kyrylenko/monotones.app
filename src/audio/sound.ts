import { soundUrl } from '../assets';
import type { SoundId } from '../constants/soundIds';
import { createBrownNoiseBuffer } from './brownNoise';
import { prepareLoop, wholeLoop, type Loop } from './loop';
import { createGainVolumeControl, getAudioContext } from './volumeControl';

/** One playable sound, either an mp3 file or generated in the browser */
export interface Sound {
    /** Call within the user gesture that starts playback; resolves once the sound plays */
    play(): Promise<void>;
    pause(): void;
    setVolume(volume: number): void;
}

interface LoopSoundOptions {
    /** Drop the loop on pause and load it again on the next play: decoded files take ~350 KB per second */
    release?: boolean;
    getContext?: () => AudioContext;
}

// Loops a buffer with Web Audio: sample-accurate, so the repetition has no gap
export const createLoopSound = (
    load: (context: AudioContext) => Promise<Loop>,
    { release = false, getContext = getAudioContext }: LoopSoundOptions = {},
): Sound => {
    // A buffer source plays only once, so every play starts a new one into this node, which stays connected
    let input: GainNode | undefined;
    let loading: Promise<Loop> | undefined;
    let source: AudioBufferSourceNode | undefined;
    let isPlaying = false;
    const volume = createGainVolumeControl(context => (input = context.createGain()), getContext);

    const startSource = (context: AudioContext, { buffer, start, loopStart, loopEnd }: Loop) => {
        source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.loopStart = loopStart;
        source.loopEnd = loopEnd;
        source.connect(input!);
        source.start(0, start);
    };

    return {
        play() {
            volume.beforePlay();
            const context = getContext();
            isPlaying = true;
            if (!loading) {
                const current = load(context);
                loading = current;
                current.catch(() => { if (loading === current) loading = undefined; });
            }
            const current = loading;
            const started = current.then(loop => {
                // Paused while loading, or already playing after an earlier play()
                if (isPlaying && !source && current === loading) {
                    startSource(context, loop);
                }
            });
            // A context created outside a user gesture stays suspended until the browser allows audio
            const resumed = context.state === 'running' ? Promise.resolve() : context.resume();
            return Promise.all([started, resumed]).then(() => undefined);
        },
        pause() {
            isPlaying = false;
            source?.stop();
            source?.disconnect();
            source = undefined;
            if (release) {
                loading = undefined;
            }
        },
        setVolume: volume.setVolume,
    };
};

// Downloads (or takes from the service worker cache) and decodes an mp3, ready to loop
const loadFile = (url: string) => async (context: AudioContext): Promise<Loop> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${response.status} ${url}`);
    }
    return prepareLoop(await context.decodeAudioData(await response.arrayBuffer()));
};

const generators: Partial<Record<SoundId, (context: BaseAudioContext) => AudioBuffer>> = {
    brown_noise: createBrownNoiseBuffer,
};

export const createSound = (id: SoundId): Sound => {
    const generate = generators[id];
    return generate
        // Generated loops are small (8 s) and kept
        ? createLoopSound(async context => wholeLoop(generate(context)))
        : createLoopSound(loadFile(soundUrl(id)), { release: true });
};
