import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import pause from '../assets/icons/pause.webp';
import play from '../assets/icons/play.webp';
import { setGlobalPlay } from '../store/thunks';
import { selectActiveSounds, selectIsGlobalPlay } from '../store/selectors';

const GlobalPlayPause = () => {
    const nodeRef = useRef(null);
    const dispatch = useDispatch();
    const isGlobalPlay = useSelector(selectIsGlobalPlay);
    const hasActiveSounds = useSelector(selectActiveSounds).length > 0;

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
                    style={{ opacity: isGlobalPlay ? 1 : null }}
                    title={isGlobalPlay ? 'Pause' : 'Play'} />
            </CSSTransition>
        </div>
    );
};

export default GlobalPlayPause;
