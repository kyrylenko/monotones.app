import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Slider from 'rc-slider';
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
            <Button variant='secondary' size='lg' onClick={this.stop}>Cancel Timer</Button> :
            <Button variant='primary' size='lg' onClick={this.start}>Start</Button>;
        return (
            <Modal show={this.props.isOpen} onHide={this.props.toggle} size='sm' autoFocus={false} centered={true}>
                <Modal.Header closeButton className='py-2'></Modal.Header>
                <Modal.Body style={{ color: 'black' }}>
                    <h5 className='text-center mb-3'>{`Pause in ${minutes}:${seconds} min`}</h5>
                    {!this.props.timerRun && <Slider
                        className='mx-auto'
                        min={30}
                        max={3600}
                        step={30}
                        onChange={(value) => this.setState({ interval: value })}
                        value={this.state.interval}
                        styles={{
                            track: { height: '6px', backgroundColor: '#A3D9F0' },
                            rail: { height: '6px', backgroundColor: '#CBE7F3' },
                            handle: {
                                height: 24,
                                width: 24,
                                marginTop: -9,
                            },
                        }}
                        style={{ width: '90%' }} />}
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    {button}
                </Modal.Footer>
            </Modal>
        );
    }
}
