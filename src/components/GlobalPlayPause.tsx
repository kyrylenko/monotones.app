import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import pause from '../assets/icons/pause.webp';
import play from '../assets/icons/play.webp';
import { setGlobalPlay } from '../store/thunks';
import { selectActiveSounds, selectIsGlobalPlay } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const GlobalPlayPause = () => {
    const nodeRef = useRef<HTMLImageElement>(null);
    const dispatch = useAppDispatch();
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);
    const hasActiveSounds = useAppSelector(selectActiveSounds).length > 0;

    if (!hasActiveSounds) {
        return null;
    }

    return (
        <div className='play-div'>
            <CSSTransition
                nodeRef={nodeRef}
                in={true}
                classNames='example'
                appear={true}
                timeout={1000}
                enter={false}
                exit={false}>
                <img ref={nodeRef} onClick={() => dispatch(setGlobalPlay(!isGlobalPlay))}
                    alt={isGlobalPlay ? 'Pause' : 'Play'}
                    src={isGlobalPlay ? pause : play}
                    style={{ opacity: isGlobalPlay ? 1 : undefined }}
                    title={isGlobalPlay ? 'Pause' : 'Play'} />
            </CSSTransition>
        </div>
    );
};

export default GlobalPlayPause;
