import { useEffect, useRef } from 'react';
import { createSound, type Sound } from '../audio/sound';
import { mainActions } from '../store/mainSlice';
import { useAppDispatch } from '../store/hooks';
import type { SoundId } from '../constants/soundIds';

interface PlayerProps {
    id: SoundId;
    isPlay: boolean;
    volume: number;
    /** Sleep timer fade-out, applied on top of the volume */
    fade: number;
    isGlobalPlay: boolean;
}

// Invisible player for one sound
const Player = ({ id, isPlay, volume, fade, isGlobalPlay }: PlayerProps) => {
    const dispatch = useAppDispatch();
    const soundRef = useRef<Sound>(null);

    // Effects run in order: the sound exists before the ones below use it
    useEffect(() => {
        const sound = createSound(id);
        soundRef.current = sound;
        return () => sound.pause();
    }, [id]);

    useEffect(() => {
        soundRef.current!.setVolume(volume);
    }, [volume]);

    useEffect(() => {
        soundRef.current!.setFade(fade);
    }, [fade]);

    // Runs synchronously after a click (React flushes effects of discrete events), so play() stays in the user gesture
    useEffect(() => {
        const sound = soundRef.current!;
        if (isPlay && isGlobalPlay) {
            sound.play()
                .then(() => dispatch(mainActions.setSoundLoaded(id)))
                .catch(error => console.log('Error while loading sound ', id, error));
        } else {
            sound.pause();
        }
    }, [id, isPlay, isGlobalPlay, dispatch]);

    return null;
};

export default Player;
