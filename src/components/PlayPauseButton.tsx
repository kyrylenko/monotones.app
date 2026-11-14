import type { Ref } from 'react';
import pause from '../assets/icons/pause.webp';
import play from '../assets/icons/play.webp';
import { setGlobalPlay } from '../store/thunks';
import { selectIsGlobalPlay } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// Plays or pauses all sounds; pausing also cancels the sleep timer
const PlayPauseButton = ({ ref }: { ref?: Ref<HTMLImageElement> }) => {
    const dispatch = useAppDispatch();
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);

    return (
        <img ref={ref} onClick={() => dispatch(setGlobalPlay(!isGlobalPlay))}
            alt={isGlobalPlay ? 'Pause' : 'Play'}
            src={isGlobalPlay ? pause : play}
            style={{ opacity: isGlobalPlay ? 1 : undefined }}
            title={isGlobalPlay ? 'Pause' : 'Play'} />
    );
};

export default PlayPauseButton;
