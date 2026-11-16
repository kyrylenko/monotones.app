import { useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { iconUrl } from '../assets';
import { mainActions } from '../store/mainSlice';
import { useAppDispatch } from '../store/hooks';
import {
    POSITION_STEP, REMOVE_DISTANCE, iconSize, orbitRadius, positionToVolume, slotAngle, volumeToPosition, type OrbitGeometry,
} from '../utils/orbit';
import type { SoundSetting } from '../types';

interface SoundOrbProps {
    sound: SoundSetting;
    index: number;
    count: number;
    geo: OrbitGeometry;
    stageRef: RefObject<HTMLDivElement | null>;
    isLoading: boolean;
}

// Pointer moves shorter than this are a tap, not a drag
const DRAG_THRESHOLD = 6;
const VALUE_SHOWN_MS = 1200;

// A sound in the orbit: drag toward the moon for louder, away for quieter, past the dotted ring to remove.
// Keyboard: arrow keys change the volume, Delete removes it.
const SoundOrb = ({ sound, index, count, geo, stageRef, isLoading }: SoundOrbProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [drag, setDrag] = useState<{ x: number; y: number; isOut: boolean } | null>(null);
    const [showValue, setShowValue] = useState(false);
    const pointer = useRef<{ x: number; y: number; moved: boolean } | null>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const position = volumeToPosition(sound.volume);
    const percent = Math.round(position * 100);
    const name = t(`sound_${sound.id}`);
    const size = iconSize(geo, position);
    const angle = slotAngle(index, count);
    const radius = orbitRadius(geo, position);
    const x = drag ? drag.x : geo.cx + Math.cos(angle) * radius;
    const y = drag ? drag.y : geo.cy + Math.sin(angle) * radius;

    const setPosition = (value: number) => dispatch(mainActions.setVolume({ id: sound.id, volume: positionToVolume(value) }));
    const remove = () => dispatch(mainActions.pauseSound(sound.id));
    const flashValue = () => {
        setShowValue(true);
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setShowValue(false), VALUE_SHOWN_MS);
    };

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture?.(event.pointerId);
        pointer.current = { x: event.clientX, y: event.clientY, moved: false };
    };

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const start = pointer.current;
        const stage = stageRef.current?.getBoundingClientRect();
        if (!start || !stage) {
            return;
        }
        if (!start.moved && Math.hypot(event.clientX - start.x, event.clientY - start.y) < DRAG_THRESHOLD) {
            return;
        }
        start.moved = true;
        const dx = event.clientX - stage.left - geo.cx;
        const dy = event.clientY - stage.top - geo.cy;
        const distance = Math.hypot(dx, dy) || 1;
        // Not closer than the inner ring: the moon stays clear
        const shown = Math.max(geo.rMin, distance);
        const isOut = distance > geo.rMax + REMOVE_DISTANCE;
        setDrag({ x: geo.cx + dx / distance * shown, y: geo.cy + dy / distance * shown, isOut });
        if (!isOut) {
            setPosition((geo.rMax - distance) / (geo.rMax - geo.rMin));
        }
    };

    const onPointerEnd = () => {
        if (drag?.isOut) {
            remove();
        } else if (pointer.current) {
            flashValue();
        }
        pointer.current = null;
        setDrag(null);
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
            setPosition(position + POSITION_STEP);
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
            setPosition(position - POSITION_STEP);
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
            remove();
        } else {
            return;
        }
        event.preventDefault();
        flashValue();
    };

    const label = drag?.isOut ? t('release_to_remove') : drag || showValue ? `${name} · ${percent}%` : name;

    return (
        <div
            className={`orb${drag ? ' dragging' : ''}${drag?.isOut ? ' out' : ''}${isLoading ? ' loading' : ''}${drag || showValue ? ' active' : ''}`}
            style={{ width: size, height: size, transform: `translate(${x - size / 2}px, ${y - size / 2}px)` }}
            role='slider'
            tabIndex={0}
            aria-label={t('volume_of', { name })}
            aria-valuemin={Math.round(volumeToPosition(0) * 100)}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-valuetext={`${percent}%`}
            data-sound={sound.id}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onKeyDown={onKeyDown}
            onBlur={() => setShowValue(false)}>
            <img src={iconUrl(sound.id)} alt='' draggable={false} />
            <span className='orb-label' aria-hidden='true'>{label}</span>
        </div>
    );
};

export default SoundOrb;
