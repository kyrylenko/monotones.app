import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import '../App.css';

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
                    src={props.isGlobPlay ? require('../assets/icons/pause.png') : require('../assets/icons/play.png')}
                    style={{ opacity: props.isGlobPlay ? 1 : null }} title={props.isGlobPlay ? "Pause" : "Play"}>
                </img>

            </CSSTransitionGroup>
        </div>

    );
};

