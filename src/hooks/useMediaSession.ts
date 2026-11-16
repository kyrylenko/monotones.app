import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import defaultValues from '../constants/defaultValues';
import { activeMixName } from '../utils/mixName';
import { setGlobalPlay } from '../store/thunks';
import { selectActiveSounds, selectIsGlobalPlay } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const ARTWORK: MediaImage[] = [
    { src: '/logo-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/logo.png', sizes: '512x512', type: 'image/png' },
];

// Lock screen and notification controls (Media Session API): the mix name, play and pause.
// https://developer.mozilla.org/docs/Web/API/Media_Session_API
const useMediaSession = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);
    const hasSounds = useAppSelector(selectActiveSounds).length > 0;
    const name = useAppSelector(state => activeMixName(state, t)) ?? t('your_mix');

    useEffect(() => {
        if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') {
            return;
        }
        const session = navigator.mediaSession;
        session.metadata = hasSounds ? new MediaMetadata({ title: name, artist: defaultValues.appName, artwork: ARTWORK }) : null;
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
