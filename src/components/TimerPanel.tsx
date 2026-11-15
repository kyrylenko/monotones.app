import { useTranslation } from 'react-i18next';
import { secToMin } from '../utils/time';
import { TIMER_MINUTES } from '../utils/orbit';
import { timerActions } from '../store/timerSlice';
import { setGlobalPlay } from '../store/thunks';
import { selectActiveSounds, selectTimer } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// Sleep timer durations; choosing one also starts playback
const TimerPanel = ({ onDone }: { onDone: () => void }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { timerRun, interval } = useAppSelector(selectTimer);
    const hasSounds = useAppSelector(selectActiveSounds).length > 0;
    const current = timerRun ? TIMER_MINUTES.find(m => m * 60 >= interval) ?? null : 0;
    const { minutes, seconds } = secToMin(interval);

    const choose = (duration: number) => {
        if (duration === 0) {
            dispatch(timerActions.timerStop());
        } else {
            dispatch(timerActions.timerStart(duration * 60));
            if (hasSounds) {
                dispatch(setGlobalPlay(true));
            }
        }
        onDone();
    };

    return (
        <>
            {timerRun && <p className='timer-value'>{t('timer_left', { time: `${minutes}:${seconds}` })}</p>}
            <div className='timer-options'>
                {[0, ...TIMER_MINUTES].map(duration => (
                    <button key={duration} type='button' className='button' aria-pressed={current === duration} onClick={() => choose(duration)}>
                        {duration ? t('minutes', { count: duration }) : t('timer_off')}
                    </button>
                ))}
            </div>
            <p className='dialog-note'>{t('timer_note')}</p>
        </>
    );
};

export default TimerPanel;
