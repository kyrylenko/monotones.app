import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

export interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

// Modal panel: a bottom sheet on phones, a centered card on wider screens.
// Closes with the close button, Escape or a tap on the backdrop.
const Dialog = ({ isOpen, onClose, title, children }: DialogProps) => {
    const { t } = useTranslation();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const opener = document.activeElement as HTMLElement | null;
        // Focus moves into the dialog, unless a field inside already took it (autoFocus)
        if (!panelRef.current?.contains(document.activeElement)) {
            panelRef.current?.focus();
        }
        const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            opener?.focus?.();
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className='dialog-backdrop' onClick={event => event.target === event.currentTarget && onClose()}>
            <div ref={panelRef} className='dialog' role='dialog' aria-modal='true' aria-label={title} tabIndex={-1}>
                <div className='dialog-header'>
                    <h2>{title}</h2>
                    <button type='button' className='icon-button' aria-label={t('close')} onClick={onClose}>×</button>
                </div>
                {children}
            </div>
        </div>,
        document.body,
    );
};

export default Dialog;
