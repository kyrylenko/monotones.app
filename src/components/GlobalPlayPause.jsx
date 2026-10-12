import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import pause from '../assets/icons/pause.webp'
import play from '../assets/icons/play.webp'

const GlobalPlayPause = ({ isGlobPlay, playPause }) => {
    const nodeRef = useRef(null);

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
                <img ref={nodeRef} onClick={() => playPause(!isGlobPlay)}
                    alt={isGlobPlay ? 'Pause' : 'Play'}
                    src={isGlobPlay ? pause : play}
                    style={{ opacity: isGlobPlay ? 1 : null }}
                    title={isGlobPlay ? 'Pause' : 'Play'}>
                </img>
            </CSSTransition>
        </div>
    );
};

export default GlobalPlayPause;