import { memo } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import loading from '../assets/icons/loading.gif';
import { iconUrl } from '../assets';
import { idToTitle } from '../utils/sounds';
import { sliderStyles, sliderValue } from './sliderStyles';
import type { SoundId } from '../constants/soundIds';
import type { SoundSetting } from '../types';

export type PlayPauseVolume = (sound: SoundSetting) => void;

interface SoundSliderProps {
    id: SoundId;
    title: string;
    isPlay: boolean;
    isLoaded: boolean;
    volume: number;
    isGlobalPlay: boolean;
    playPauseVolume: PlayPauseVolume;
}

// Sound icon (toggles playback) with its volume slider
const SoundSlider = memo(({ id, title, isPlay, isLoaded, volume, isGlobalPlay, playPauseVolume }: SoundSliderProps) => {
    const isPlaying = isPlay && isGlobalPlay;

    return (
        <>
            <img alt={title} className={`sound-icon${isPlaying ? ' breathing' : ''}`}
                src={!isLoaded && isPlaying ? loading : iconUrl(id)}
                title={idToTitle(title)}
                style={{ opacity: isPlay ? 1 : undefined }}
                onClick={() => playPauseVolume({ id, isPlay: !isPlay, volume })} />
            <Slider
                className='mx-auto'
                max={1}
                step={0.01}
                onChange={(value) => playPauseVolume({ id, isPlay, volume: sliderValue(value), isLoaded })}
                value={volume}
                styles={sliderStyles}
                style={{ visibility: isPlay ? 'visible' : 'hidden', width: '80%' }} />
        </>
    );
});

export default SoundSlider;
