import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from './Dialog';
import Slider from './Slider';
import { secToMin } from '../utils/time';
import { timerActions } from '../store/timerSlice';
import { selectTimer } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { ModalProps } from './modalProps';

const DEFAULT_DURATION = 300; // seconds

const SleepTimerModal = ({ isOpen, onClose }: ModalProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { timerRun, interval: timeLeft } = useAppSelector(selectTimer);
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const { minutes, seconds } = secToMin(timerRun ? timeLeft : duration);

    const start = () => {
        dispatch(timerActions.timerStart(duration));
        onClose();
    };

    const stop = () => {
        dispatch(timerActions.timerStop());
        onClose();
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={t('sleep_timer')}>
            <p className='timer-value'>{`Pause in ${minutes}:${seconds} min`}</p>
            {!timerRun && <Slider
                min={30}
                max={3600}
                step={30}
                label={t('sleep_timer')}
                valueText={`${minutes}:${seconds}`}
                onChange={setDuration}
                value={duration} />}
            <div className='dialog-actions'>
                {timerRun
                    ? <button type='button' className='button' onClick={stop}>Cancel Timer</button>
                    : <button type='button' className='button button-primary' onClick={start}>Start</button>}
            </div>
        </Dialog>
    );
};

export default SleepTimerModal;
