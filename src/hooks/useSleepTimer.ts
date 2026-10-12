import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { timerTick } from '../store/thunks';

// Ticks the sleep timer every second while it runs
const useSleepTimer = () => {
    const dispatch = useAppDispatch();
    const timerRun = useAppSelector(state => state.timer.timerRun);

    useEffect(() => {
        if (!timerRun) {
            return undefined;
        }

        const id = setInterval(() => dispatch(timerTick()), 1000);
        return () => clearInterval(id);
    }, [timerRun, dispatch]);
};

export default useSleepTimer;
