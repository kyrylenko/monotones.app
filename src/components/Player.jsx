import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { soundUrl } from '../assets';
import { mainActions } from '../store/mainSlice';

const isFirefox = typeof InstallTrigger !== 'undefined';
// Seconds before the end to jump back to the start: avoids an audible gap where `loop` is not seamless
const LOOP_BUFFER = 0.44;

const createAudio = (id) => {
    const audio = new Audio(soundUrl(id));
    audio.crossOrigin = 'anonymous';
    audio.loop = isFirefox;
    audio.preload = 'none';

    audio.addEventListener('timeupdate', () => {
        if (!isFirefox && audio.currentTime > audio.duration - LOOP_BUFFER) {
            audio.currentTime = 0;
            audio.play();
        }
    });

    return audio;
};

// Invisible <audio> for one sound
const Player = ({ id, isPlay, volume, isGlobalPlay }) => {
    const dispatch = useDispatch();
    const audioRef = useRef(null);

    // Effects run in order: the audio exists before the ones below use it
    useEffect(() => {
        const audio = createAudio(id);
        audioRef.current = audio;
        return () => audio.pause();
    }, [id]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (isPlay && isGlobalPlay) {
            audio.play()
                .then(() => dispatch(mainActions.setSoundLoaded(id)))
                .catch(error => console.log('Error while loading sound ', id, error));
        } else if (!audio.paused) {
            audio.pause();
        }
    }, [id, isPlay, isGlobalPlay, dispatch]);

    return null;
};

export default Player;
