// The living night sky behind the orbit: pure state and physics, drawn by draw.ts.
// Stars glow when a tap ripple passes them, drift after a swipe, swirl when the screen turns and shift with tilt.
// While sound plays, slow waves leave the moon.

export interface Star {
    /** Position as parts of the sky size, 0..1 */
    x: number;
    y: number;
    radius: number;
    /** Twinkle phase */
    phase: number;
    /** 0.3 (far) .. 1 (near): near stars move more */
    depth: number;
    /** Drift speed in px per second */
    vx: number;
    vy: number;
    /** Glow after a ripple, 1..0 */
    glow: number;
}

export interface Ripple { x: number; y: number; age: number }

export interface SkyState {
    stars: Star[];
    ripples: Ripple[];
    /** Ages of the waves around the moon, in seconds */
    waves: number[];
    sinceWave: number;
    /** Tilt, -1..1, eased toward the target */
    parallax: { x: number; y: number; targetX: number; targetY: number };
    time: number;
}

export interface SkyFrame {
    width: number;
    height: number;
    isPlaying: boolean;
    /** Dim screen or reduced motion: no waves, no movement */
    isCalm: boolean;
}

export const RIPPLE_SPEED = 500; // px per second
export const RIPPLE_LIFE = 1.8; // seconds
export const WAVE_LIFE = 8;
export const WAVE_EVERY = 3.4;
export const PARALLAX_PX = 16;
const DRIFT_DAMPING = 0.9; // per second
const GLOW_DAMPING = 1.1;
const MAX_SPEED = 400;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const createSky = (count = 120, random: () => number = Math.random): SkyState => ({
    stars: Array.from({ length: count }, () => ({
        x: random(), y: random(), radius: 0.4 + random(), phase: random() * Math.PI * 2, depth: 0.3 + random() * 0.7, vx: 0, vy: 0, glow: 0,
    })),
    ripples: [],
    waves: [],
    sinceWave: WAVE_EVERY,
    parallax: { x: 0, y: 0, targetX: 0, targetY: 0 },
    time: 0,
});

/** Where a star is drawn, in px, after the tilt parallax */
export const starPosition = (state: SkyState, star: Star, width: number, height: number) => ({
    x: star.x * width - state.parallax.x * PARALLAX_PX * star.depth,
    y: star.y * height - state.parallax.y * PARALLAX_PX * star.depth,
});

export const addRipple = (state: SkyState, x: number, y: number) => {
    state.ripples.push({ x, y, age: 0 });
};

/** A swipe of dx, dy px sends the stars drifting that way */
export const swipe = (state: SkyState, dx: number, dy: number) => {
    for (const star of state.stars) {
        star.vx = clamp(star.vx + dx * 5 * star.depth, -MAX_SPEED, MAX_SPEED);
        star.vy = clamp(star.vy + dy * 5 * star.depth, -MAX_SPEED, MAX_SPEED);
    }
};

/** The screen turned: the stars swirl around the center */
export const swirl = (state: SkyState, width: number, height: number) => {
    for (const star of state.stars) {
        const dx = star.x * width - width / 2;
        const dy = star.y * height - height / 2;
        const length = Math.hypot(dx, dy) || 1;
        star.vx += -dy / length * 90 * star.depth;
        star.vy += dx / length * 90 * star.depth;
    }
};

/** Tilt from -1 to 1 on both axes */
export const tilt = (state: SkyState, x: number, y: number) => {
    state.parallax.targetX = clamp(x, -1, 1);
    state.parallax.targetY = clamp(y, -1, 1);
};

/** Advances the sky by dt seconds */
export const step = (state: SkyState, dt: number, { width, height, isPlaying, isCalm }: SkyFrame) => {
    state.time += dt;
    const ease = Math.min(1, dt * 3);
    state.parallax.x += (state.parallax.targetX - state.parallax.x) * ease;
    state.parallax.y += (state.parallax.targetY - state.parallax.y) * ease;

    for (const ripple of state.ripples) {
        ripple.age += dt;
    }
    state.ripples = state.ripples.filter(ripple => ripple.age < RIPPLE_LIFE);

    const drift = Math.exp(-dt * DRIFT_DAMPING);
    const fade = Math.exp(-dt * GLOW_DAMPING);
    for (const star of state.stars) {
        star.vx *= drift;
        star.vy *= drift;
        star.glow *= fade;
        if (width > 0 && height > 0) {
            star.x = ((star.x + star.vx * dt / width) % 1 + 1) % 1;
            star.y = ((star.y + star.vy * dt / height) % 1 + 1) % 1;
        }
        const { x, y } = starPosition(state, star, width, height);
        for (const ripple of state.ripples) {
            const dx = x - ripple.x;
            const dy = y - ripple.y;
            const distance = Math.hypot(dx, dy) || 1;
            // The ring of light passes the star: it lights up and is pushed outward a little
            if (Math.abs(distance - ripple.age * RIPPLE_SPEED) < 16 && star.glow < 0.8) {
                star.glow = 1;
                if (!isCalm) {
                    star.vx += dx / distance * 24 * star.depth;
                    star.vy += dy / distance * 24 * star.depth;
                }
            }
        }
    }

    state.waves = state.waves.map(age => age + dt).filter(age => age < WAVE_LIFE);
    state.sinceWave += dt;
    if (isPlaying && !isCalm && state.sinceWave >= WAVE_EVERY) {
        state.waves.push(0);
        state.sinceWave = 0;
    }
};

/** 0..1..0 over 10 seconds: 5 s in, 5 s out, a calm breathing pace */
export const breath = (time: number) => 0.5 + 0.5 * Math.sin(time * Math.PI * 2 / 10);
