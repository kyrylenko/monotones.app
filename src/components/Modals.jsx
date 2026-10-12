import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
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
            <Modal show={this.props.isOpen} onHide={this.props.toggle} size='sm' autoFocus={false} >
                <Modal.Header closeButton style={{ color: 'black' }} className='py-2'>{t('save_mixture')}</Modal.Header>
                <Modal.Body>
                    <input type='text' name='text' id='mixture-name' placeholder={t('mixture_name')} maxLength='25' autoFocus
                        onChange={this.updateInputValue} onKeyPress={this.handleKeyPress} className='form-control'></input>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' size='lg' onClick={this.save}>{t('save')}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default withTranslation()(SaveMixtureModal);
