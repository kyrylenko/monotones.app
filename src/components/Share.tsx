import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from './Dialog';
import { buildShareUrl } from '../utils/shareCode';
import { copyText, shareLink } from '../utils/share';
import { activeMixName } from '../utils/mixName';
import defaultValues from '../constants/defaultValues';
import { selectSounds } from '../store/selectors';
import { useAppStore } from '../store/hooks';

// Shares the playing sounds: the system share sheet where there is one, otherwise a dialog with the link to copy
const Share = ({ className, children }: { className: string; children: ReactNode }) => {
    const { t } = useTranslation();
    const store = useAppStore();
    const [url, setUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // The link is built on click and carries the name of the active mix
    const share = async () => {
        const state = store.getState();
        const name = activeMixName(state, t) ?? undefined;
        const link = buildShareUrl(selectSounds(state), name);
        if (!await shareLink(link, name ?? defaultValues.appName)) {
            setCopied(false);
            setUrl(link);
        }
    };

    const copy = async () => setCopied(await copyText(url!));

    return (
        <>
            <button type='button' className={className} onClick={share}>
                {children}
            </button>
            <Dialog isOpen={url !== null} onClose={() => setUrl(null)} title={t('share_sounds')}>
                <div className='dialog-row'>
                    <input type='url' className='text-input' readOnly value={url ?? ''} aria-label={t('share_sounds')}
                        onFocus={event => event.target.select()} />
                    <button type='button' className='button button-primary' onClick={copy}>{t('copy')}</button>
                </div>
                <p className='dialog-note' role='status'>{copied ? t('link_copied') : ''}</p>
            </Dialog>
        </>
    );
};

export default Share;
