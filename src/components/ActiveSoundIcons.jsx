import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import MixAnim from './MixAnim';
import { iconUrl } from '../assets';
import { idToTitle } from '../utils/sounds';
import { mainActions } from '../store/mainSlice';
import { selectActiveSounds } from '../store/selectors';

// Icons of the playing sounds, clicking one pauses it
const ActiveSoundIcons = ({ className }) => {
    const dispatch = useDispatch();
    const activeSounds = useSelector(selectActiveSounds);

    return (
        <TransitionGroup className={className}>
            {activeSounds.map(({ id }) => (
                <MixAnim key={id}>
                    <div className='mixture-item'>
                        <img
                            className='mixture-img'
                            src={iconUrl(id)}
                            id={id}
                            alt={id}
                            title={`${idToTitle(id)} - Pause`}
                            onClick={() => dispatch(mainActions.pauseSound(id))} />
                    </div>
                </MixAnim>
            ))}
        </TransitionGroup>
    );
};

export default ActiveSoundIcons;
