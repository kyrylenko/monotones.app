import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from './Dialog';
import { buildShareUrl } from '../utils/shareCode';
import { copyText, shareLink } from '../utils/share';
import { starterMixes } from '../constants/starterMixes';
import defaultValues from '../constants/defaultValues';
import { selectActiveStarterMix, selectMixtures, selectSharedMixName, selectSounds } from '../store/selectors';
import { useAppStore } from '../store/hooks';

// Shares the playing sounds: the system share sheet where there is one, otherwise a dialog with the link to copy
const Share = ({ className }: { className: string }) => {
    const { t } = useTranslation();
    const store = useAppStore();
    const [url, setUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // The link is built on click, so the header does not re-render on every sound change.
    // It carries the name of the active mix: a saved mixture, a starter mix or a mix opened from a link.
    const share = async () => {
        const state = store.getState();
        const starterMix = starterMixes.find(mix => mix.id === selectActiveStarterMix(state));
        const name = selectMixtures(state).find(mixture => mixture.isActive)?.id
            ?? (starterMix ? t(`starter_${starterMix.id}`) : selectSharedMixName(state) ?? undefined);
        const link = buildShareUrl(selectSounds(state), name);
        if (!await shareLink(link, name ?? defaultValues.appName)) {
            setCopied(false);
            setUrl(link);
        }
    };

    const copy = async () => setCopied(await copyText(url!));

    return (
        <>
            <button type='button' className={className} title={t('share_sounds')} onClick={share}>
                {t('share')}
            </button>
            <Dialog isOpen={url !== null} onClose={() => setUrl(null)} title={t('share_sounds')}>
                <div className='dialog-row'>
                    <input type='url' className='text-input' readOnly value={url ?? ''} aria-label={t('share_link')}
                        onFocus={event => event.target.select()} />
                    <button type='button' className='button button-primary' onClick={copy}>{t('copy')}</button>
                </div>
                <p className='dialog-note' role='status'>{copied ? t('link_copied') : ''}</p>
            </Dialog>
        </>
    );
};

export default Share;
