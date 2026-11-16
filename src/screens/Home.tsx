import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Orbit from '../components/Orbit';
import SoundTray from '../components/SoundTray';
import Dock from '../components/Dock';
import Dialog from '../components/Dialog';
import MixesPanel from '../components/MixesPanel';
import TimerPanel from '../components/TimerPanel';
import SharedMixBanner from '../components/SharedMixBanner';
import Sky from '../sky/Sky';
import useIsMobile from '../hooks/useIsMobile';
import { selectActiveSounds, selectIsGlobalPlay } from '../store/selectors';
import { useAppSelector } from '../store/hooks';

const NOTICE_MS = 2600;

// The sound screen: the orbit, the sound tray and the dock; the mixes in a side panel on desktop, in a sheet on phones
const Home = ({ intro }: { intro?: string }) => {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const isGlobalPlay = useAppSelector(selectIsGlobalPlay);
    const hasSounds = useAppSelector(selectActiveSounds).length > 0;
    const isPlaying = isGlobalPlay && hasSounds;
    const [sheet, setSheet] = useState<'mixes' | 'timer' | null>(null);
    const [isDim, setDim] = useState(false);
    const [notice, setNotice] = useState<{ text: string; id: number } | null>(null);

    const closeSheet = useCallback(() => setSheet(null), []);
    const onNotice = useCallback((text: string) => setNotice({ text, id: Date.now() }), []);

    useEffect(() => {
        if (!notice) {
            return;
        }
        const id = setTimeout(() => setNotice(null), NOTICE_MS);
        return () => clearTimeout(id);
    }, [notice]);

    // Dim screen: everything fades except the sky; a tap anywhere or Escape wakes it
    useEffect(() => {
        if (!isDim) {
            return;
        }
        document.body.classList.add('is-dim');
        const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setDim(false);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.classList.remove('is-dim');
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isDim]);

    return (
        <div className={`home${isPlaying ? ' is-playing' : ''}`}>
            <Sky isPlaying={isPlaying} isDim={isDim} />
            <SharedMixBanner />
            <Orbit onNotice={onNotice} />
            {/* A starter mix page (/mix/...) describes its mix in its own row, so the orbit fits above it */}
            {intro && <p className='mix-intro'>{intro}</p>}
            {/* The dock comes right after the orbit in the tab order; the grid places it at the bottom */}
            <Dock
                onMixesClick={isMobile ? () => setSheet('mixes') : undefined}
                onTimerClick={() => setSheet('timer')}
                onDimClick={() => setDim(true)}
                onNotice={onNotice} />
            <SoundTray onNotice={onNotice} />
            {!isMobile && <aside className='mixes-panel' aria-label={t('mixes')}>
                <h2 className='panel-title'>{t('mixes')}</h2>
                <MixesPanel />
            </aside>}
            <Dialog isOpen={isMobile && sheet === 'mixes'} onClose={closeSheet} title={t('mixes')}>
                <MixesPanel onPicked={closeSheet} />
            </Dialog>
            <Dialog isOpen={sheet === 'timer'} onClose={closeSheet} title={t('sleep_timer')}>
                <TimerPanel onDone={closeSheet} />
            </Dialog>
            {isDim && <button type='button' className='wake' onClick={() => setDim(false)}>{t('wake')}</button>}
            {notice && <p key={notice.id} className='notice' role='status'>{notice.text}</p>}
        </div>
    );
};

export default Home;
