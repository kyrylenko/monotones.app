import { useTranslation } from 'react-i18next';
import Share from './Share';
import { setGlobalPlay } from '../store/thunks';
import { requestMotionPermission } from '../sky/motion';
import { selectActiveSounds, selectIsGlobalPlay, selectTimer } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// Line icons in currentColor
const MixesIcon = () => (
    <svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='6' cy='7' r='1.6' /><circle cx='17' cy='5' r='1.6' /><circle cx='12' cy='14' r='1.6' /><circle cx='19' cy='18' r='1.6' /><path d='M7.4 7.9l3.4 4.8M13.2 12.8l3-6.3M13.5 14.9l4 2.4' /></svg>
);
const TimerIcon = () => <svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='12' cy='13' r='8' /><path d='M12 9v4l2.5 2M9.5 2.5h5' /></svg>;
const DimIcon = () => <svg viewBox='0 0 24 24' aria-hidden='true'><path d='M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z' /></svg>;
const ShareIcon = () => <svg viewBox='0 0 24 24' aria-hidden='true'><path d='M12 15V3.5M8 7l4-3.5L16 7M6 11.5v8h12v-8' /></svg>;
const PlayIcon = () => <svg viewBox='0 0 24 24' aria-hidden='true'><path d='M8 5v14l11-7z' /></svg>;
const PauseIcon = () => <svg viewBox='0 0 24 24' aria-hidden='true'><path d='M7 5h3.5v14H7zM13.5 5H17v14h-3.5z' /></svg>;

interface DockProps {
    /** Phones only: on desktop the mixes stay in a side panel */
    onMixesClick?: () => void;
    onTimerClick: () => void;
    onDimClick: () => void;
    onNotice: (text: string) => void;
}

// The one control area for playback: mixes, sleep timer, play/pause, dim screen and share
const Dock = ({ onMixesClick, onTimerClick, onDimClick, onNotice }: DockProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);
    const hasSounds = useAppSelector(selectActiveSounds).length > 0;
    const { timerRun, interval } = useAppSelector(selectTimer);
    const isPlaying = isGlobalPlay && hasSounds;

    const togglePlay = () => {
        if (!hasSounds) {
            onNotice(t('add_sound_first'));
            return;
        }
        // The first play is a tap: the moment iOS allows asking for the tilt sensor of the sky
        requestMotionPermission();
        dispatch(setGlobalPlay(!isGlobalPlay));
    };

    return (
        <nav className='dock' aria-label={t('playback')}>
            {onMixesClick && <button type='button' className='dock-button' onClick={onMixesClick}><MixesIcon />{t('mixes')}</button>}
            <button type='button' className={`dock-button${timerRun ? ' on' : ''}`} onClick={onTimerClick}>
                <TimerIcon />
                <span className='timer-label'>{timerRun ? t('minutes', { count: Math.ceil(interval / 60) }) : t('timer')}</span>
            </button>
            <button type='button' className='play-button' aria-label={isPlaying ? t('pause') : t('play')} onClick={togglePlay}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button type='button' className='dock-button' onClick={onDimClick}><DimIcon />{t('dim')}</button>
            <Share className='dock-button'><ShareIcon />{t('share')}</Share>
        </nav>
    );
};

export default Dock;
