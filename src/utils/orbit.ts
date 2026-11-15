// Geometry of the orbit: closer to the moon = louder.
// The dial position p (0 = outer ring, 1 = by the moon) maps to volume p², a perceptual taper,
// so stored volumes (0..1, saved mixes and share links) keep their meaning.

export const MIN_POSITION = 0.1;
/** Arrow keys move a sound by this much of the dial */
export const POSITION_STEP = 0.05;

export const volumeToPosition = (volume: number): number => Math.min(1, Math.max(MIN_POSITION, Math.sqrt(volume)));
export const positionToVolume = (position: number): number => {
    const p = Math.min(1, Math.max(MIN_POSITION, position));
    return Math.round(p * p * 1000) / 1000;
};

export interface OrbitGeometry {
    /** Center of the moon, in stage coordinates */
    cx: number;
    cy: number;
    moonRadius: number;
    /** Radius of the loudest (inner) and quietest (outer, dotted) ring */
    rMin: number;
    rMax: number;
    /** Size factor for icons on large screens */
    scale: number;
}

export const orbitGeometry = (width: number, height: number): OrbitGeometry => {
    const rMax = Math.min(300, Math.max(110, Math.min(width, height) / 2 - 46));
    const scale = Math.min(1.45, Math.max(1, rMax / 150));
    const moonRadius = Math.round(30 * Math.min(scale, 1.3));
    return { cx: width / 2, cy: height / 2 - 6, moonRadius, rMin: moonRadius + 34 * scale + 14, rMax, scale };
};

export const orbitRadius = (geo: OrbitGeometry, position: number): number => geo.rMax - position * (geo.rMax - geo.rMin);

export const iconSize = (geo: OrbitGeometry, position: number): number => Math.round((34 + 32 * position) * geo.scale);

/** Sounds sit evenly around the moon, the first one at the top */
export const slotAngle = (index: number, count: number): number => -Math.PI / 2 + index * 2 * Math.PI / Math.max(1, count);

/** Dragged this far past the outer ring, a sound is removed on release */
export const REMOVE_DISTANCE = 34;

// The sleep timer starts from these durations; the moon wanes from the full chosen one
export const TIMER_MINUTES = [5, 15, 30, 45, 60, 90] as const;

/** Part of the timer left, 1..0. The chosen duration is the smallest one that holds the seconds left. */
export const timerFraction = (secondsLeft: number): number => {
    const total = (TIMER_MINUTES.find(m => m * 60 >= secondsLeft) ?? Math.ceil(secondsLeft / 60)) * 60;
    return Math.min(1, Math.max(0, secondsLeft / total));
};
