import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import pause from '../assets/icons/pause.svg'
import play from '../assets/icons/play.svg'

export const GlobalPlayPause = ({isGlobPlay, playPause}) => {

    const clickHandler = () => playPause(!isGlobPlay);

    return (
        <div className='play-div'>
            <CSSTransitionGroup
                transitionName='example'
                transitionAppear={true}
                transitionAppearTimeout={1000}
                transitionEnter={false}
                transitionLeave={false}>
                <img onClick={clickHandler}
                    alt={isGlobPlay ? 'Pause' : 'Play'}
                    src={isGlobPlay ? pause : play}
                    style={{ opacity: isGlobPlay ? 1 : null }}
                    title={isGlobPlay ? 'Pause' : 'Play'}>
                </img>
            </CSSTransitionGroup>
        </div>
    );
};