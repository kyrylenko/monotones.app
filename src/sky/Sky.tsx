import { useEffect, useRef } from 'react';
import { addRipple, createSky, step, swipe, swirl, tilt } from './sky';
import { drawSky } from './draw';

interface SkyProps {
    isPlaying: boolean;
    isDim: boolean;
}

// Taps shorter than this are a tap, longer moves are a swipe
const TAP_DISTANCE = 8;
// Tilt angles that move the stars the most, in degrees
const TILT_RANGE = 30;
const MAX_PIXEL_RATIO = 2;

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// Living night sky drawn on a canvas behind the sound screen.
// Taps and swipes on the empty sky (the orbit stage outside the sounds and the moon) reach it.
// Drawing stops while the page is hidden; the audio is not affected.
const Sky = ({ isPlaying, isDim }: SkyProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const props = useRef({ isPlaying, isDim });

    useEffect(() => {
        props.current = { isPlaying, isDim };
    }, [isPlaying, isDim]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) {
            return;
        }
        const sky = createSky();
        let width = 0;
        let height = 0;
        let frame = 0;
        let last = 0;

        const resize = () => {
            const ratio = Math.min(MAX_PIXEL_RATIO, window.devicePixelRatio || 1);
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        // Moon and outer ring, measured each frame because the layout changes (resize, sheets, desktop panels)
        const moonView = () => {
            const moon = document.querySelector<HTMLElement>('.moon-button');
            const stage = moon?.closest<HTMLElement>('.stage');
            if (!moon || !stage) {
                return null;
            }
            const box = moon.getBoundingClientRect();
            const origin = canvas.getBoundingClientRect();
            return {
                x: box.left + box.width / 2 - origin.left,
                y: box.top + box.height / 2 - origin.top,
                radius: Number(stage.dataset.moon) || box.width / 2,
                ring: Number(stage.dataset.ring) || 150,
            };
        };

        const draw = (now: number) => {
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
            last = now;
            const isReducedMotion = reducedMotion();
            const { isPlaying: playing, isDim: dim } = props.current;
            step(sky, isReducedMotion ? dt * 0.15 : dt, { width, height, isPlaying: playing, isCalm: dim || isReducedMotion });
            drawSky(ctx, sky, { width, height, moon: moonView(), isPlaying: playing, isDim: dim, isReducedMotion });
            frame = requestAnimationFrame(draw);
        };

        const start = () => {
            cancelAnimationFrame(frame);
            last = 0;
            if (!document.hidden) {
                frame = requestAnimationFrame(draw);
            }
        };

        // Pointer on the empty sky: a tap sends a ripple, a swipe makes the stars drift
        let pointer: { x: number; y: number; lastX: number; lastY: number; moved: boolean } | null = null;
        const isEmptySky = (target: EventTarget | null) =>
            target instanceof Element && !!target.closest('.stage') && !target.closest('.orb, button');
        const onPointerDown = (event: PointerEvent) => {
            pointer = isEmptySky(event.target)
                ? { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false }
                : null;
        };
        const onPointerMove = (event: PointerEvent) => {
            if (!pointer) {
                return;
            }
            if (Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > TAP_DISTANCE) {
                pointer.moved = true;
            }
            if (pointer.moved && !reducedMotion()) {
                swipe(sky, event.clientX - pointer.lastX, event.clientY - pointer.lastY);
            }
            pointer.lastX = event.clientX;
            pointer.lastY = event.clientY;
        };
        const onPointerUp = () => {
            if (pointer && !pointer.moved) {
                const origin = canvas.getBoundingClientRect();
                addRipple(sky, pointer.x - origin.left, pointer.y - origin.top);
            }
            pointer = null;
        };
        const onOrientation = (event: DeviceOrientationEvent) => {
            if (event.gamma !== null && event.beta !== null) {
                tilt(sky, event.gamma / TILT_RANGE, (event.beta - 45) / TILT_RANGE);
            }
        };
        const onMouseMove = (event: MouseEvent) => tilt(sky, (event.clientX / width - 0.5) * 2, (event.clientY / height - 0.5) * 2);
        const onTurn = () => {
            resize();
            if (!reducedMotion()) {
                swirl(sky, width, height);
            }
        };

        resize();
        start();
        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
        observer?.observe(canvas);
        document.addEventListener('visibilitychange', start);
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('pointercancel', onPointerUp);
        document.addEventListener('mousemove', onMouseMove);
        window.addEventListener('deviceorientation', onOrientation);
        screen.orientation?.addEventListener('change', onTurn);

        return () => {
            cancelAnimationFrame(frame);
            observer?.disconnect();
            document.removeEventListener('visibilitychange', start);
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('pointercancel', onPointerUp);
            document.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('deviceorientation', onOrientation);
            screen.orientation?.removeEventListener('change', onTurn);
        };
    }, []);

    return <canvas ref={canvasRef} className='sky' aria-hidden='true' />;
};

export default Sky;
