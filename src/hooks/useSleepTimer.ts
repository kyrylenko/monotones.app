import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { timerTick } from '../store/thunks';

// Ticks the sleep timer every second while it runs
const useSleepTimer = () => {
    const dispatch = useDispatch();
    const timerRun = useSelector(state => state.timer.timerRun);

    useEffect(() => {
        if (!timerRun) {
            return undefined;
        }

        const id = setInterval(() => dispatch(timerTick()), 1000);
        return () => clearInterval(id);
    }, [timerRun, dispatch]);
};

export default useSleepTimer;
