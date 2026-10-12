import React from 'react';
import { useSelector } from 'react-redux';
import Player from './Player';
import { selectAllSounds, selectIsGlobalPlay } from '../store/selectors';

const SoundPlayers = () => {
    const sounds = useSelector(selectAllSounds);
    const isGlobalPlay = useSelector(selectIsGlobalPlay);

    return sounds.map(({ id, isPlay, volume }) => (
        <Player key={id} id={id} isPlay={isPlay} volume={volume} isGlobalPlay={isGlobalPlay} />
    ));
};

export default SoundPlayers;
