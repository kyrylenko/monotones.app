import Player from './Player';
import { selectAllSounds, selectFadeLevel, selectIsGlobalPlay } from '../store/selectors';
import { useAppSelector } from '../store/hooks';

const SoundPlayers = () => {
    const sounds = useAppSelector(selectAllSounds);
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);
    const fade = useAppSelector(selectFadeLevel);

    return sounds.map(({ id, isPlay, volume }) => (
        <Player key={id} id={id} isPlay={isPlay} volume={volume} fade={fade} isGlobalPlay={isGlobalPlay} />
    ));
};

export default SoundPlayers;
