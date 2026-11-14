import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { starterMixes } from '../constants/starterMixes';
import { mainActions } from '../store/mainSlice';
import defaultValues from '../constants/defaultValues';
import { selectActiveStarterMix, selectSharedMixName } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { ModalProps } from './modalProps';

const SaveMixtureModal = ({ isOpen, onClose }: ModalProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const activeStarterMix = useAppSelector(selectActiveStarterMix);
    const sharedMixName = useAppSelector(selectSharedMixName);
    const [name, setName] = useState('');

    // Saving a starter mix or a mix opened from a link suggests its name, so it becomes the user's own mixture
    const suggestName = () => {
        const starterMix = starterMixes.find(mix => mix.id === activeStarterMix);
        setName(starterMix ? t(`starter_${starterMix.id}`) : sharedMixName ?? '');
    };

    const close = () => {
        setName('');
        onClose();
    };

    const save = () => {
        if (name !== '') {
            dispatch(mainActions.addMixture(name));
        }
        close();
    };

    return (
        <Modal show={isOpen} onShow={suggestName} onHide={close} size='sm' autoFocus={false}>
            <Modal.Header closeButton className='py-2'>{t('save_mixture')}</Modal.Header>
            <Modal.Body>
                <input type='text' name='text' id='mixture-name' placeholder={t('mixture_name')} maxLength={defaultValues.mixtureNameMaxLength} autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && save()}
                    className='form-control' />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' size='lg' onClick={save}>{t('save')}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SaveMixtureModal;
