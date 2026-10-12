import React, { useRef, useState } from 'react';
import { useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SharePopover from './SharePopover';
import { buildShareUrl } from '../utils/shareCode';
import { selectSounds } from '../store/selectors';

const Share = ({ className }) => {
    const { t } = useTranslation();
    const store = useStore();
    const targetRef = useRef(null);
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
