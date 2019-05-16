import React from 'react';
import Button from 'reactstrap/lib/Button';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalBody from 'reactstrap/lib/ModalBody';
import Slider from 'rc-slider/lib/Slider';
import { secToMin } from '../utils/Utils';

export default class TimerModal extends React.Component {

    state = {
        interval: 300//sec 
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
                <ModalHeader toggle={this.props.toggle} className='py-2'></ModalHeader>
                <ModalBody style={{ color: 'black' }}>
                    <h5 className='text-center mb-3'>{`Pause in ${minutes}:${seconds} min`}</h5>
                    {!this.props.timerRun && <Slider
                        className='mx-auto'
                        min={30}
                        max={3600}
                        step={30}
                        onChange={(value) => this.setState({ interval: value })}
                        value={this.state.interval}
                        trackStyle={{ height: '6px', backgroundColor: '#A3D9F0' }}
                        railStyle={{ height: '6px', backgroundColor: '#CBE7F3' }}
                        handleStyle={{
                            height: 24,
                            width: 24,
                            marginTop: -9,
                        }}
                        style={{ width: '90%' }} />}
                </ModalBody>
                <ModalFooter className='d-flex justify-content-center'>
                    {button}
                </ModalFooter>
            </Modal>
        );
    }
}
