// The sleep timer fades the sounds out during its last seconds: a sudden silence can wake a sleeping baby
export const FADE_OUT_SECONDS = 30;

// Volume multiplier (0-1) for the seconds left on the timer.
// Squared because loudness is perceived logarithmically: a linear fade sounds steady and then drops at the end
export const fadeOutLevel = (secondsLeft: number): number => {
    const progress = Math.min(Math.max(secondsLeft / FADE_OUT_SECONDS, 0), 1);
    return progress * progress;
};
