import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import loading from '../assets/icons/loading.gif';
import { iconUrl } from '../assets';
import { idToTitle } from '../utils/sounds';
import Slider from './Slider';
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
    const { t } = useTranslation();
    const isPlaying = isPlay && isGlobalPlay;

    return (
        <>
            <img alt={title} className={`sound-icon${isPlaying ? ' breathing' : ''}`}
                src={!isLoaded && isPlaying ? loading : iconUrl(id)}
                title={idToTitle(title)}
                style={{ opacity: isPlay ? 1 : undefined }}
                onClick={() => playPauseVolume({ id, isPlay: !isPlay, volume })} />
            <Slider
                label={t('volume_of', { name: idToTitle(title) })}
                value={volume}
                valueText={`${Math.round(volume * 100)}%`}
                onChange={value => playPauseVolume({ id, isPlay, volume: value, isLoaded })}
                style={{ visibility: isPlay ? 'visible' : 'hidden' }} />
        </>
    );
});

export default SoundSlider;
