import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class TimerModal extends React.Component {

    state = {
        interval: '1'
    };

    start = () => {
        this.props.timer(this.state.interval, true);
        this.props.toggle();
    };

    stop = () => {
        this.props.timer(this.state.interval, false);
        this.props.toggle();
    };

    handleKeyPress = (target) => {
        if (target.charCode === 13) {
            this.start();
        }
    };

    scroll = (e) => {
        //console.log(e.target.value)
    };

    render() {
        //TODO: move this logic out from render (performance)
        /* let min = [];
        for (let i = 0; i <= 59; i++) {
            min.push(<li key={i}>{i}</li>)
        }
        let hour = [];
        for (let i = 0; i <= 11; i++) {
            hour.push(<li key={i}>{i < 10 ? `0${i}` : i}</li>)
        } */
        //console.log(this.state)
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size='sm' autoFocus={false} centered={true} >
                <ModalHeader toggle={this.props.toggle}>Set pause interval</ModalHeader>
                <ModalBody>
                    <input type='number'
                        value={this.state.interval}
                        autoFocus={true}
                        min={1}
                        max={60}
                        onWheel={this.scroll}
                        onChange={(e) => this.setState({ interval: e.target.value })}></input>
                    {/* <div className='d-flex justify-content-center interval-selector' style={{ height: '300px' }}>
                        <ul style={{ listStyleType: 'none', fontSize: '2.5rem', width: '50%', padding: 0 }} onScroll={this.scroll}>
                            {hour}
                        </ul>
                        <ul style={{ listStyleType: 'none', fontSize: '2.5rem', width: '50%', padding: 0 }}>
                            {min}
                        </ul>
                    </div> */}
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={this.stop}>Cancel</Button>
                    <Button color='primary' onClick={this.start}>Start</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
