import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from './Dialog';
import { starterMixes } from '../constants/starterMixes';
import { mainActions } from '../store/mainSlice';
import defaultValues from '../constants/defaultValues';
import { selectActiveStarterMix, selectSharedMixName } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { ModalProps } from './modalProps';

// Mounted each time the dialog opens, so the name starts from the suggestion again
const SaveForm = ({ suggestedName, onClose }: { suggestedName: string; onClose: () => void }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [name, setName] = useState(suggestedName);

    const save = (event: FormEvent) => {
        event.preventDefault();
        if (name.trim() !== '') {
            dispatch(mainActions.addMixture(name.trim()));
        }
        onClose();
    };

    return (
        <form className='dialog-row' onSubmit={save}>
            <input type='text' name='text' id='mixture-name' className='text-input' autoComplete='off' autoFocus
                placeholder={t('mixture_name')} aria-label={t('mixture_name')} maxLength={defaultValues.mixtureNameMaxLength}
                value={name}
                onChange={e => setName(e.target.value)} />
            <button type='submit' className='button button-primary'>{t('save')}</button>
        </form>
    );
};

const SaveMixtureModal = ({ isOpen, onClose }: ModalProps) => {
    const { t } = useTranslation();
    const activeStarterMix = useAppSelector(selectActiveStarterMix);
    const sharedMixName = useAppSelector(selectSharedMixName);

    // Saving a starter mix or a mix opened from a link suggests its name, so it becomes the user's own mixture
    const starterMix = starterMixes.find(mix => mix.id === activeStarterMix);
    const suggestedName = starterMix ? t(`starter_${starterMix.id}`) : sharedMixName ?? '';

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={t('save_mixture')}>
            <SaveForm suggestedName={suggestedName} onClose={onClose} />
        </Dialog>
    );
};

export default SaveMixtureModal;
