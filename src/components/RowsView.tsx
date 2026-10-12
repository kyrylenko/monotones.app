import { memo } from 'react';
import SoundSlider, { type PlayPauseVolume } from './SoundSlider';
import type { SoundState } from '../types';

// Pairs of sounds: one row with a left and a right sound
const toPairs = (sounds: SoundState[]): [SoundState, SoundState][] => {
    const pairs: [SoundState, SoundState][] = [];
    for (let i = 0; i < sounds.length - 1; i += 2) {
        pairs.push([sounds[i], sounds[i + 1]]);
    }
    return pairs;
};

interface CellProps {
    sound: SoundState;
    isGlobalPlay: boolean;
    playPauseVolume: PlayPauseVolume;
}

const SoundCell = ({ sound, isGlobalPlay, playPauseVolume }: CellProps) => (
    <div className='text-center col-6 col-sm-4 col-md-3 col-lg-3'>
        <SoundSlider
            id={sound.id}
            isGlobalPlay={isGlobalPlay}
            isPlay={sound.isPlay}
            isLoaded={sound.isLoaded}
            volume={sound.volume}
            title={sound.id}
            playPauseVolume={playPauseVolume} />
    </div>
);

interface RowsViewProps {
    sounds: SoundState[];
    isGlobalPlay: boolean;
    playPauseVolume: PlayPauseVolume;
}

const RowsView = memo(({ sounds, isGlobalPlay, playPauseVolume }: RowsViewProps) => (
    <div className='container'>
        {toPairs(sounds).map(([left, right]) => (
            <div key={left.id} className='sounds-row row justify-content-center'>
                <SoundCell sound={left} isGlobalPlay={isGlobalPlay} playPauseVolume={playPauseVolume} />
                <div className='d-none d-sm-none d-md-block col-sm-2 col-md-2 col-lg-2'></div>
                <SoundCell sound={right} isGlobalPlay={isGlobalPlay} playPauseVolume={playPauseVolume} />
            </div>
        ))}
    </div>
));

export default RowsView;
