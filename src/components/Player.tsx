import { useEffect, useRef } from 'react';
import { soundUrl } from '../assets';
import { createVolumeControl, type VolumeControl } from '../audio/volumeControl';
import { mainActions } from '../store/mainSlice';
import { useAppDispatch } from '../store/hooks';
import type { SoundId } from '../constants/soundIds';

// Firefox-only global, used to detect the browser
declare const InstallTrigger: unknown;
const isFirefox = typeof InstallTrigger !== 'undefined';
// Seconds before the end to jump back to the start: avoids an audible gap where `loop` is not seamless
const LOOP_BUFFER = 0.44;

interface Sound {
    audio: HTMLAudioElement;
    volume: VolumeControl;
}

const createSound = (id: SoundId): Sound => {
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

    return { audio, volume: createVolumeControl(audio) };
};

interface PlayerProps {
    id: SoundId;
    isPlay: boolean;
    volume: number;
    /** Sleep timer fade-out, applied on top of the volume */
    fade: number;
    isGlobalPlay: boolean;
}

// Invisible <audio> for one sound
const Player = ({ id, isPlay, volume, fade, isGlobalPlay }: PlayerProps) => {
    const dispatch = useAppDispatch();
    const soundRef = useRef<Sound>(null);

    // Effects run in order: the sound exists before the ones below use it
    useEffect(() => {
        const sound = createSound(id);
        soundRef.current = sound;
        return () => sound.audio.pause();
    }, [id]);

    useEffect(() => {
        soundRef.current!.volume.setVolume(volume);
    }, [volume]);

    useEffect(() => {
        soundRef.current!.volume.setFade(fade);
    }, [fade]);

    // Runs synchronously after a click (React flushes effects of discrete events), so play() stays in the user gesture
    useEffect(() => {
        const { audio, volume: volumeControl } = soundRef.current!;
        if (isPlay && isGlobalPlay) {
            volumeControl.beforePlay();
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
