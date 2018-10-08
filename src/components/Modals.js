import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form } from 'reactstrap';

export class SaveMixtureModal extends React.Component {
    state = {
        inputValue: ''
    };
    updateInputValue = (evt) => {
        this.setState({
            inputValue: evt.target.value
        });
    };

    save = (val) => {
        //console.log(val);
        this.props.save(val);
        this.props.toggle();
    };

    //isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
    //value={this.state.inputValue}
    //isOpen={this.state.modal} toggle={this.toggleModal} size='sm' autoFocus={false} save={this.props.addMixture}
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size='sm' autoFocus={false}
            //{...this.props}
            >
                <ModalHeader toggle={this.props.toggle}>Save mixture</ModalHeader>
                <ModalBody>
                    <Input type="text" name="text" id="mixture-name" placeholder="Mixture name" maxLength="25" autoFocus
                        onChange={evt => this.updateInputValue(evt)} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.save(this.state.inputValue)}>Save</Button>
                    <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
