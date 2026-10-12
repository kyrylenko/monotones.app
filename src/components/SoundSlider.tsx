import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import loading from '../assets/icons/loading.gif';
import { iconUrl } from '../assets';
import { idToTitle } from '../utils/sounds';
import { sliderStyles } from './sliderStyles';

// Sound icon (toggles playback) with its volume slider
const SoundSlider = React.memo(({ id, title, isPlay, isLoaded, volume, isGlobalPlay, playPauseVolume }) => {
    const isPlaying = isPlay && isGlobalPlay;

    return (
        <>
            <img alt={title} className={`sound-icon${isPlaying ? ' breathing' : ''}`}
                src={!isLoaded && isPlaying ? loading : iconUrl(id)}
                title={idToTitle(title)}
                style={{ opacity: isPlay ? 1 : null }}
                onClick={() => playPauseVolume({ id, isPlay: !isPlay, volume })} />
            <Slider
                className='mx-auto'
                max={1}
                step={0.01}
                onChange={(newVolume) => playPauseVolume({ id, isPlay, volume: newVolume, isLoaded })}
                value={volume}
                styles={sliderStyles}
                style={{ visibility: isPlay ? 'visible' : 'hidden', width: '80%' }} />
        </>
    );
});

export default SoundSlider;
