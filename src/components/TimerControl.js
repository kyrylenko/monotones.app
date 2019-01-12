
import React from 'react';
import timer from '../assets/icons/timer.svg';
import { secToMin } from '../utils/Utils';

const TimerControl = (props) => {
    const { minutes, seconds } = secToMin(props.interval);

    const element = props.timerRun ?
        <div className='timer-circle' onClick={props.onClick}>
            <div className='my-3' >{`${minutes}:${seconds}`}</div>
        </div> :
        <img src={timer} alt='Timer' title='Set pause interval' onClick={props.onClick}></img>;

    return element;
};

export default TimerControl;