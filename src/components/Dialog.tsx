import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

export interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';

// Tab and Shift+Tab cycle through the controls of the dialog instead of leaving it
const keepFocusInside = (panel: HTMLElement | null, event: KeyboardEvent) => {
    const controls = panel ? [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)] : [];
    if (!panel || controls.length === 0) {
        return;
    }
    const first = controls[0];
    const last = controls[controls.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === panel)) {
        last.focus();
        event.preventDefault();
    } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        first.focus();
        event.preventDefault();
    }
};

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
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            } else if (event.key === 'Tab') {
                keepFocusInside(panelRef.current, event);
            }
        };
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
