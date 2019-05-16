import React from 'react';
import Button from 'reactstrap/lib/Button';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalBody from 'reactstrap/lib/ModalBody';
import { secToMin } from '../utils/Utils';

export default class TimerModal extends React.Component {

    state = {
        interval: '300'//sec 
    };

    start = () => {
        this.props.start(this.state.interval);
        this.props.toggle();
    };

    stop = () => {
        this.props.stop();
        this.props.toggle();
    };

    handleKeyPress = (target) => {
        if (target.charCode === 13) {
            this.start();
        }
    };

    scroll = (e) => { };

    render() {
        const { minutes, seconds } = secToMin(this.props.timerRun ? this.props.interval : this.state.interval);

        const button = this.props.timerRun ?
            <Button color='secondary' size='lg' onClick={this.stop}>Cancel Timer</Button> :
            <Button color='primary' size='lg' onClick={this.start}>Start</Button>;
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size='sm' autoFocus={false} centered={true}>
                <ModalHeader toggle={this.props.toggle}></ModalHeader>
                <ModalBody style={{ color: 'black' }}>
                    <h4 className='text-center'>{`Pause in ${minutes}:${seconds} min`}</h4>
                    {!this.props.timerRun && <input type='range'
                        className='custom-range'
                        value={this.state.interval}
                        autoFocus={true}
                        min={30}
                        max={3600}
                        step={30}
                        onWheel={this.scroll}
                        onChange={(e) => this.setState({ interval: e.target.value })}></input>}
                </ModalBody>
                <ModalFooter className='d-flex justify-content-center'>
                    {button}
                </ModalFooter>
            </Modal>
        );
    }
}
