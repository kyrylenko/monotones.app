import { memo } from 'react';
import SoundSlider, { type PlayPauseVolume } from './SoundSlider';
import type { SoundState } from '../types';

// Pairs of sounds: one row with a left and a right sound. With an odd count the last row has only the left one.
const toPairs = (sounds: SoundState[]): [SoundState, SoundState | undefined][] => {
    const pairs: [SoundState, SoundState | undefined][] = [];
    for (let i = 0; i < sounds.length; i += 2) {
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
    <div className='sound-cell'>
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
    <div className='sound-board'>
        {toPairs(sounds).map(([left, right]) => (
            <div key={left.id} className='sounds-row'>
                <SoundCell sound={left} isGlobalPlay={isGlobalPlay} playPauseVolume={playPauseVolume} />
                {right && <>
                    <div className='sounds-row-gap'></div>
                    <SoundCell sound={right} isGlobalPlay={isGlobalPlay} playPauseVolume={playPauseVolume} />
                </>}
            </div>
        ))}
    </div>
));

export default RowsView;
