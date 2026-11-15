import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SoundOrb from './SoundOrb';
import useElementSize from '../hooks/useElementSize';
import defaultValues from '../constants/defaultValues';
import { setGlobalPlay } from '../store/thunks';
import { selectActiveSounds, selectIsGlobalPlay, selectTimer } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { orbitGeometry, timerFraction, type OrbitGeometry } from '../utils/orbit';
import { requestMotionPermission } from '../sky/motion';

// Craters of the moon: x, y and radius as parts of the moon radius
const CRATERS = [[-0.3, -0.27, 0.2], [0.27, 0.13, 0.27], [-0.2, 0.4, 0.13], [0.4, -0.4, 0.1]];

// The moon wanes from the right as the sleep timer runs out; a play triangle shows while paused
const Moon = ({ geo, isPlaying, fraction }: { geo: OrbitGeometry; isPlaying: boolean; fraction: number }) => {
    const r = geo.moonRadius;
    const size = r * 2;
    return (
        <svg className='moon' width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} aria-hidden='true'>
            <defs>
                <clipPath id='moon-clip'><circle r={r} /></clipPath>
            </defs>
            <g clipPath='url(#moon-clip)'>
                <circle r={r} className='moon-face' />
                {CRATERS.map(([x, y, cr]) => <circle key={x} cx={x * r} cy={y * r} r={cr * r} className='moon-crater' />)}
                {fraction < 1 && <circle cx={2.06 * r * Math.max(0.05, fraction)} r={r * 1.03} className='moon-shadow' />}
            </g>
            {!isPlaying && <path className='moon-play' d={`M${-0.23 * r} ${-0.33 * r}L${0.37 * r} 0L${-0.23 * r} ${0.33 * r}Z`} />}
        </svg>
    );
};

// The mix as a night sky: the playing sounds orbit the moon, which plays and pauses
const Orbit = ({ onNotice }: { onNotice: (text: string) => void }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const stageRef = useRef<HTMLDivElement>(null);
    const { width, height } = useElementSize(stageRef);
    const activeSounds = useAppSelector(selectActiveSounds);
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);
    const { timerRun, interval } = useAppSelector(selectTimer);

    // Before the first measurement (and in tests) a phone-sized stage
    const geo = orbitGeometry(width || 360, height || 480);
    const isPlaying = isGlobalPlay && activeSounds.length > 0;
    const fraction = timerRun ? timerFraction(interval) : 1;
    const count = activeSounds.length;
    const max = defaultValues.maxSounds;
    const hint = count === 0 ? t('hint_empty') : count === 1 ? t('hint_one') : count >= max ? t('hint_full', { max }) : '';

    const togglePlay = () => {
        if (count === 0) {
            onNotice(t('add_sound_first'));
            return;
        }
        requestMotionPermission();
        dispatch(setGlobalPlay(!isGlobalPlay));
    };

    return (
        <div className='stage' ref={stageRef} data-moon={geo.moonRadius} data-ring={geo.rMax}>
            <svg className='rings' width='100%' height='100%' aria-hidden='true'>
                <circle cx={geo.cx} cy={geo.cy} r={geo.rMin} className='ring' />
                <circle cx={geo.cx} cy={geo.cy} r={(geo.rMin + geo.rMax) / 2} className='ring ring-faint' />
                <circle cx={geo.cx} cy={geo.cy} r={geo.rMax} className='ring ring-edge' />
                {timerRun && <circle cx={geo.cx} cy={geo.cy} r={geo.moonRadius + 9} className='timer-arc'
                    pathLength={1} strokeDasharray={`${fraction} 1`} transform={`rotate(-90 ${geo.cx} ${geo.cy})`} />}
            </svg>
            <button type='button' className='moon-button' aria-label={isPlaying ? t('pause') : t('play')} onClick={togglePlay}
                style={{ left: geo.cx, top: geo.cy, width: geo.moonRadius * 2 + 20, height: geo.moonRadius * 2 + 20 }}>
                <Moon geo={geo} isPlaying={isPlaying} fraction={fraction} />
            </button>
            {activeSounds.map((sound, index) => (
                <SoundOrb key={sound.id} sound={sound} index={index} count={count} geo={geo} stageRef={stageRef}
                    isLoading={isGlobalPlay && !sound.isLoaded} />
            ))}
            <p className='stage-hint'>{hint}</p>
        </div>
    );
};

export default Orbit;
