import { useEffect, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import PlayPauseButton from './PlayPauseButton';
import TimerControl from './TimerControl';
import { selectIsGlobalPlay } from '../store/selectors';
import { useAppSelector } from '../store/hooks';

interface SleepScreenProps {
    onClose: () => void;
    onTimerClick: () => void;
}

// Dim full-screen view for a dark room: only play/pause and the sleep timer.
// A tap anywhere else (or Escape) closes it.
const SleepScreen = ({ onClose, onTimerClick }: SleepScreenProps) => {
    const { t } = useTranslation();
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const closeOnBackground = (event: MouseEvent) => event.target === event.currentTarget && onClose();

    return (
        <div className='sleep-screen' role='dialog' aria-label={t('sleep_screen')} onClick={closeOnBackground}>
            <div className='sleep-screen-controls'>
                <PlayPauseButton />
                {isGlobalPlay && <TimerControl onClick={onTimerClick} />}
            </div>
            <div className='sleep-screen-hint'>{t('sleep_screen_hint')}</div>
        </div>
    );
};

export default SleepScreen;
