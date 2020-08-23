import React from 'react';
import Button from 'reactstrap/lib/Button';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalBody from 'reactstrap/lib/ModalBody';
import { withTranslation } from 'react-i18next';

class SaveMixtureModal extends React.Component {
    state = {
        inputValue: ''
    };
    updateInputValue = (evt) => {
        this.setState({
            inputValue: evt.target.value
        });
    };

    save = () => {
        if (this.state.inputValue !== '') {
            this.props.save(this.state.inputValue);
        }
        this.props.toggle();
    };

    handleKeyPress = (target) => {
        if (target.charCode === 13) {
            this.save();
        }
    };

    render() {
        const { t } = this.props;
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size='sm' autoFocus={false} >
                <ModalHeader toggle={this.props.toggle} style={{ color: 'black' }} className='py-2'>{t('save_mixture')}</ModalHeader>
                <ModalBody>
                    <input type='text' name='text' id='mixture-name' placeholder={t('mixture_name')} maxLength='25' autoFocus
                        onChange={this.updateInputValue} onKeyPress={this.handleKeyPress} className='form-control'></input>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' size='lg' onClick={this.save}>{t('save')}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default withTranslation()(SaveMixtureModal);
