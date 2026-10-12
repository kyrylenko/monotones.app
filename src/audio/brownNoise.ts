// Length of the generated loop; long enough that the repetition is not noticeable
const LOOP_SECONDS = 8;
const PEAK = 0.9;

// Fills one channel with brown noise (integrated white noise) that loops without a click
export const fillBrownNoise = (data: Float32Array, random: () => number = Math.random): void => {
    const length = data.length;
    let last = 0;
    for (let i = 0; i < length; i++) {
        // Leaky integrator: the leak keeps the random walk from drifting away
        last = (last + 0.02 * (random() * 2 - 1)) / 1.02;
        data[i] = last;
    }

    // Remove the drift between the ends so the last sample leads back into the first one
    const drift = data[length - 1] - data[0];
    let sum = 0;
    for (let i = 0; i < length; i++) {
        data[i] -= drift * i / length;
        sum += data[i];
    }

    // Center around zero and normalize the loudness
    const mean = sum / length;
    let peak = 0;
    for (let i = 0; i < length; i++) {
        data[i] -= mean;
        peak = Math.max(peak, Math.abs(data[i]));
    }
    const scale = peak > 0 ? PEAK / peak : 0;
    for (let i = 0; i < length; i++) {
        data[i] *= scale;
    }
};

// Stereo loop of brown noise, each channel generated separately for a wider sound
export const createBrownNoiseBuffer = (context: BaseAudioContext): AudioBuffer => {
    const buffer = context.createBuffer(2, LOOP_SECONDS * context.sampleRate, context.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        fillBrownNoise(buffer.getChannelData(channel));
    }
    return buffer;
};
