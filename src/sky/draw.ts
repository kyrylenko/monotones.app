import { RIPPLE_LIFE, RIPPLE_SPEED, WAVE_LIFE, breath, starPosition, type SkyState } from './sky';

export interface SkyView {
    width: number;
    height: number;
    /** Center and radius of the moon, and the outer ring, in canvas px; null when there is no orbit */
    moon: { x: number; y: number; radius: number; ring: number } | null;
    isPlaying: boolean;
    isDim: boolean;
    isReducedMotion: boolean;
}

// Moonlight and starlight, the --moon and --ink tokens of src/index.css
const MOON = '230, 220, 195';
const STAR = '214, 210, 226';

export const drawSky = (ctx: CanvasRenderingContext2D, state: SkyState, view: SkyView) => {
    const { width, height, moon, isPlaying, isDim, isReducedMotion } = view;
    ctx.clearRect(0, 0, width, height);

    for (const ripple of state.ripples) {
        const life = 1 - ripple.age / RIPPLE_LIFE;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.age * RIPPLE_SPEED, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${MOON}, ${0.13 * life})`;
        ctx.stroke();
    }

    const twinkleSpeed = isReducedMotion ? 0.08 : 0.6;
    for (const star of state.stars) {
        const { x, y } = starPosition(state, star, width, height);
        if (star.glow > 0.05) {
            const haloRadius = star.radius * 9 * star.glow;
            const halo = ctx.createRadialGradient(x, y, 0, x, y, haloRadius);
            halo.addColorStop(0, `rgba(${MOON}, ${0.35 * star.glow})`);
            halo.addColorStop(1, `rgba(${MOON}, 0)`);
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        const twinkle = 0.5 + 0.5 * Math.sin(state.time * twinkleSpeed + star.phase);
        ctx.fillStyle = `rgba(${STAR}, ${Math.min(1, (isDim ? 0.08 : 0.14) + 0.2 * twinkle + 0.75 * star.glow)})`;
        ctx.beginPath();
        ctx.arc(x, y, star.radius * (1 + star.glow), 0, Math.PI * 2);
        ctx.fill();
    }

    if (!moon) {
        return;
    }
    // Slow waves leave the moon, slightly wavy like water
    const strength = 0.5 + 0.3 * breath(state.time);
    for (const age of state.waves) {
        const progress = age / WAVE_LIFE;
        const radius = moon.radius * 1.4 + progress * (moon.ring + 90 - moon.radius);
        const alpha = 0.15 * Math.sin(Math.PI * Math.min(1, progress * 1.2)) * strength * (isPlaying ? 1 : 0.4);
        ctx.beginPath();
        for (let k = 0; k <= 96; k++) {
            const angle = k / 96 * Math.PI * 2;
            const r = radius * (1 + 0.014 * Math.sin(angle * 5 + state.time * 0.7 + age) + 0.008 * Math.sin(angle * 9 - state.time * 0.5));
            const px = moon.x + Math.cos(angle) * r;
            const py = moon.y + Math.sin(angle) * r;
            if (k === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(${MOON}, ${alpha})`;
        ctx.stroke();
    }
};
