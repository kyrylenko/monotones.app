import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import pause from '../assets/icons/pause.webp'
import play from '../assets/icons/play.webp'

const GlobalPlayPause = ({ isGlobPlay, playPause }) => {

    return (
        <div className='play-div'>
            <CSSTransitionGroup
                transitionName='example'
                transitionAppear={true}
                transitionAppearTimeout={1000}
                transitionEnter={false}
                transitionLeave={false}>
                <img onClick={() => playPause(!isGlobPlay)}
                    alt={isGlobPlay ? 'Pause' : 'Play'}
                    src={isGlobPlay ? pause : play}
                    style={{ opacity: isGlobPlay ? 1 : null }}
                    title={isGlobPlay ? 'Pause' : 'Play'}>
                </img>
            </CSSTransitionGroup>
        </div>
    );
};

export default GlobalPlayPause;