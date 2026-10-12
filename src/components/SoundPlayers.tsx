import Player from './Player';
import { selectAllSounds, selectIsGlobalPlay } from '../store/selectors';
import { useAppSelector } from '../store/hooks';

const SoundPlayers = () => {
    const sounds = useAppSelector(selectAllSounds);
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);

    return sounds.map(({ id, isPlay, volume }) => (
        <Player key={id} id={id} isPlay={isPlay} volume={volume} isGlobalPlay={isGlobalPlay} />
    ));
};

export default SoundPlayers;
