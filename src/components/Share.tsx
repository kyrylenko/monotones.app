import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SharePopover from './SharePopover';
import { buildShareUrl } from '../utils/shareCode';
import { starterMixes } from '../constants/starterMixes';
import { selectActiveStarterMix, selectMixtures, selectSharedMixName, selectSounds } from '../store/selectors';
import { useAppStore } from '../store/hooks';

const Share = ({ className }: { className: string }) => {
    const { t } = useTranslation();
    const store = useAppStore();
    const targetRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState(window.location.origin);

    // The link is built on click, so the header does not re-render on every sound change.
    // It carries the name of the active mix: a saved mixture, a starter mix or a mix opened from a link.
    const open = () => {
        const state = store.getState();
        const starterMix = starterMixes.find(mix => mix.id === selectActiveStarterMix(state));
        const name = selectMixtures(state).find(mixture => mixture.isActive)?.id
            ?? (starterMix ? t(`starter_${starterMix.id}`) : selectSharedMixName(state) ?? undefined);
        setShareUrl(buildShareUrl(selectSounds(state), name));
        setIsOpen(true);
    };

    return (
        <>
            <div ref={targetRef} className={className} title={t('share_sounds')} onClick={open} style={{ cursor: 'pointer' }}>
                {t('share')}
            </div>
            <SharePopover isOpen={isOpen} onClose={() => setIsOpen(false)} target={targetRef} url={shareUrl} />
        </>
    );
};

export default Share;
