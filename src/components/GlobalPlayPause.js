import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import '../App.css';
import pause from '../assets/icons/pause.svg'
import play from '../assets/icons/play.svg'

//Stateless presentational  component
export const GlobalPlayPause = (props) => {

    const clickHandler = () => {
        props.playPause(!props.isGlobPlay);
    };

    return (

        <div className="play-div">
            <CSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={1000}
                transitionEnter={false}
                transitionLeave={false}>
                <img onClick={clickHandler}
                    alt={props.isGlobPlay ? "Pause" : "Play"}
                    src={props.isGlobPlay ? pause : play}
                    style={{ opacity: props.isGlobPlay ? 1 : null }} title={props.isGlobPlay ? "Pause" : "Play"}>
                </img>

            </CSSTransitionGroup>
        </div>

    );
};