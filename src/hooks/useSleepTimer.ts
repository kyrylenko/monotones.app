import { useEffect } from 'react';
import { hasAudioContext, scheduleSleepFade } from '../audio/volumeControl';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { timerTick } from '../store/thunks';

// Counts the sleep timer down every second while it runs, and at once when the page shows again (screen unlocked).
// The fade-out itself is scheduled on the audio thread, which keeps running while iOS pauses the page.
const useSleepTimer = () => {
    const dispatch = useAppDispatch();
    const timerRun = useAppSelector(state => state.timer.timerRun);
    const endsAt = useAppSelector(state => state.timer.endsAt);

    useEffect(() => {
        if (!timerRun) {
            return undefined;
        }

        const tick = () => dispatch(timerTick());
        const id = setInterval(tick, 1000);
        document.addEventListener('visibilitychange', tick);
        return () => {
            clearInterval(id);
            document.removeEventListener('visibilitychange', tick);
        };
    }, [timerRun, dispatch]);

    // A new end time (timer set, changed or stopped) reschedules the fade
    useEffect(() => {
        // Nothing to restore before the first sound: the audio context is created on the first play
        if (timerRun || hasAudioContext()) {
            scheduleSleepFade(timerRun && endsAt !== null ? (endsAt - Date.now()) / 1000 : null);
        }
    }, [timerRun, endsAt]);
};

export default useSleepTimer;
