import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export class SaveMixtureModal extends React.Component {

    //isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
    render() {
        return (
            <Modal {...this.props}>
                <ModalHeader>Save mixture</ModalHeader>
                <ModalBody>
                    Misture name
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.props.save}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={this.props.cancel}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
