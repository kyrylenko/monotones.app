/** Where an AudioBufferSourceNode starts and loops, in seconds */
export interface Loop {
    buffer: AudioBuffer;
    /** Offset of the first play */
    start: number;
    loopStart: number;
    loopEnd: number;
}

// Below this every channel counts as silent: mp3 encoder padding and digital silence at the ends of a file
const SILENCE = 1e-4;
// Long enough to hide the jump between the end and the start (no click), short enough to keep rhythms (heartbeat)
const CROSSFADE_SECONDS = 0.05;

// Loops the whole buffer, for sounds generated to loop without a seam
export const wholeLoop = (buffer: AudioBuffer): Loop => ({ buffer, start: 0, loopStart: 0, loopEnd: buffer.duration });

// Makes a decoded file loop without a gap or a click:
// skips the silence at both ends and fades the end into the start (equal power, as the ends are not correlated).
// The first play starts at the head; every later round starts right after the part that was faded in.
export const prepareLoop = (buffer: AudioBuffer): Loop => {
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, i) => buffer.getChannelData(i));
    const isSound = (i: number) => channels.some(data => Math.abs(data[i]) > SILENCE);

    let first = 0;
    while (first < buffer.length && !isSound(first)) first++;
    let end = buffer.length;
    while (end > first && !isSound(end - 1)) end--;

    const fade = Math.min(Math.round(CROSSFADE_SECONDS * buffer.sampleRate), Math.floor((end - first) / 2));
    for (const data of channels) {
        for (let i = 0; i < fade; i++) {
            // From exactly the original end (continuous with what comes before) to exactly the head
            const angle = fade > 1 ? i / (fade - 1) * Math.PI / 2 : 0;
            data[end - fade + i] = data[end - fade + i] * Math.cos(angle) + data[first + i] * Math.sin(angle);
        }
    }

    const seconds = (sample: number) => sample / buffer.sampleRate;
    return { buffer, start: seconds(first), loopStart: seconds(first + fade), loopEnd: seconds(end) };
};
