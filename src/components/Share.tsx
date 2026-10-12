import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SharePopover from './SharePopover';
import { buildShareUrl } from '../utils/shareCode';
import { selectSounds } from '../store/selectors';
import { useAppStore } from '../store/hooks';

const Share = ({ className }: { className: string }) => {
    const { t } = useTranslation();
    const store = useAppStore();
    const targetRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState(window.location.origin);

    // The link is built on click, so the header does not re-render on every sound change
    const open = () => {
        setShareUrl(buildShareUrl(selectSounds(store.getState())));
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
