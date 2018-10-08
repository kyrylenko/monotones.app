import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

export class SaveMixtureModal extends React.Component {
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
    }

    //value={this.state.inputValue}
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size='sm' autoFocus={false}
            //{...this.props}
            >
                <ModalHeader toggle={this.props.toggle}>Save mixture</ModalHeader>
                <ModalBody>
                    <Input type="text" name="text" id="mixture-name" placeholder="Mixture name" maxLength="25" autoFocus
                        onChange={evt => this.updateInputValue(evt)} onKeyPress={this.handleKeyPress} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.save}>Save</Button>
                    <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
