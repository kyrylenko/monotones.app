import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { mainActions } from '../store/mainSlice';

const SaveMixtureModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [name, setName] = useState('');

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
        <Modal show={isOpen} onHide={close} size='sm' autoFocus={false}>
            <Modal.Header closeButton style={{ color: 'black' }} className='py-2'>{t('save_mixture')}</Modal.Header>
            <Modal.Body>
                <input type='text' name='text' id='mixture-name' placeholder={t('mixture_name')} maxLength='25' autoFocus
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
