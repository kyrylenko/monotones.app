
import React from 'react';
import timer from '../assets/icons/timer.webp';
import timerEmpty from '../assets/icons/timer_empty.webp';
import { secToMin } from '../utils/Utils';

const TimerControl = ({ timerRun, interval, onClick }) => {
    const { minutes, seconds } = secToMin(interval);

    const element = timerRun ?
        <div className='timer' title='Stop timer' style={{ cursor: 'pointer' }} onClick={onClick}>
            <img src={timerEmpty} alt='Timer' ></img>
            <div className='clock'>{`${minutes}:${seconds}`}</div>
        </div>
        :
        <img src={timer} alt='Timer' title='Set pause interval' onClick={onClick}></img>;

    return element;
};

export default TimerControl;