import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { secToMin } from '../utils/Utils';

export default class TimerModal extends React.Component {

    state = {
        interval: '1'//min
    };

    start = () => {
        this.props.start(this.state.interval * 60);
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
        const { minutes, seconds } = secToMin(this.props.interval);

        const comp = this.props.timerRun
            ? <h4>{`${minutes}:${seconds}`}</h4>
            : <input type='number'
                value={this.state.interval}
                autoFocus={true}
                min={1}
                max={60}
                onWheel={this.scroll}
                onChange={(e) => this.setState({ interval: e.target.value })}></input>;
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size='sm' autoFocus={false} centered={true} >
                <ModalHeader toggle={this.props.toggle}>Set pause interval</ModalHeader>
                <ModalBody className='d-flex justify-content-center'>
                    {comp}
                </ModalBody>
                <ModalFooter className='d-flex justify-content-between'>
                    <Button color='secondary' onClick={this.props.toggle}>Cancel</Button>
                    <Button color='primary' onClick={this.props.timerRun ? this.stop : this.start}>{this.props.timerRun ? 'Stop' : 'Start'}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
