import timer from '../assets/icons/timer.webp';
import timerEmpty from '../assets/icons/timer_empty.webp';
import { secToMin } from '../utils/time';
import { selectTimer } from '../store/selectors';
import { useAppSelector } from '../store/hooks';

// Timer icon, shows the countdown while the sleep timer runs
const TimerControl = ({ onClick }: { onClick: () => void }) => {
    const { timerRun, interval } = useAppSelector(selectTimer);

    if (!timerRun) {
        return <img src={timer} alt='Timer' title='Set pause interval' onClick={onClick} />;
    }

    const { minutes, seconds } = secToMin(interval);
    return (
        <div className='timer' title='Stop timer' style={{ cursor: 'pointer' }} onClick={onClick}>
            <img src={timerEmpty} alt='Timer' />
            <div className='clock'>{`${minutes}:${seconds}`}</div>
        </div>
    );
};

export default TimerControl;
