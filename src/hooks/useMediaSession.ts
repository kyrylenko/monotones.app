import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import defaultValues from '../constants/defaultValues';
import { pauseCompanion, playCompanion } from '../audio/companion';
import { activeMixName } from '../utils/mixName';
import { setGlobalPlay } from '../store/thunks';
import { selectActiveSounds, selectIsGlobalPlay } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// Absolute URLs of the app icons (precached, so they show offline too)
const artwork = (): MediaImage[] => [
    { src: new URL('/logo-192.png', location.origin).href, sizes: '192x192', type: 'image/png' },
    { src: new URL('/logo.png', location.origin).href, sizes: '512x512', type: 'image/png' },
];

// Lock screen and notification controls (Media Session API): the mix name, play and pause.
// On iOS they need a playing media element, the silent companion (audio/companion.ts).
// https://developer.mozilla.org/docs/Web/API/Media_Session_API
const useMediaSession = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);
    const hasSounds = useAppSelector(selectActiveSounds).length > 0;
    const name = useAppSelector(state => activeMixName(state, t)) ?? t('your_mix');

    // Runs right after the tap that starts playback (React flushes effects of discrete events), so iOS lets it play
    useEffect(() => {
        if (hasSounds && isGlobalPlay) {
            playCompanion();
        } else {
            pauseCompanion();
        }
    }, [hasSounds, isGlobalPlay]);

    useEffect(() => {
        if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') {
            return;
        }
        const session = navigator.mediaSession;
        session.metadata = hasSounds ? new MediaMetadata({ title: name, artist: defaultValues.appName, artwork: artwork() }) : null;
        session.playbackState = hasSounds ? (isGlobalPlay ? 'playing' : 'paused') : 'none';
    }, [name, hasSounds, isGlobalPlay]);

    useEffect(() => {
        if (!('mediaSession' in navigator)) {
            return;
        }
        const session = navigator.mediaSession;
        const actions: [MediaSessionAction, MediaSessionActionHandler][] = [
            ['play', () => dispatch(setGlobalPlay(true))],
            ['pause', () => dispatch(setGlobalPlay(false))],
            ['stop', () => dispatch(setGlobalPlay(false))],
        ];
        for (const [action, handler] of actions) {
            try {
                session.setActionHandler(action, handler);
            } catch {
                // An action the browser does not support
            }
        }
        return () => actions.forEach(([action]) => {
            try {
                session.setActionHandler(action, null);
            } catch {
                // An action the browser does not support
            }
        });
    }, [dispatch]);
};

export default useMediaSession;
