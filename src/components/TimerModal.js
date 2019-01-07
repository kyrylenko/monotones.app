import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class TimerModal extends React.Component {

    state = {
        interval: '',
        //hours: [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        scroll: 0,
        minutes: [],
        activeIndex: 0
    };

    updateInputValue = (evt) => {
        this.setState({
            interval: evt.target.value
        });
    };

    timer = () => {
        if (this.state.interval !== 0) {
            //TODO: save interval in redux
            this.props.timer(this.state.interval);
        }
        this.props.toggle();
    };

    handleKeyPress = (target) => {
        if (target.charCode === 13) {
            this.timer();
        }
    };

    scroll = (e) => {
        //scrollHeight: 720
        //scrollTop: 0-416
        //clientHeight: 304 - height of the ul
        //720 = 416 + 304
        console.log(e.target.scrollTop, e.target.scrollHeight, e.target.clientHeight)
        //itemHeight
        //e.target.scrollTop
    };

    render() {
        //TODO: move this logic out from render (performance)
        let min = [];
        for (let i = 0; i <= 59; i++) {
            min.push(<li key={i}>{i}</li>)
        }
        let hour = [];// = this.state.hours.map((x, i) => <li key={i}>{x}</li>);//[]; 
        for (let i = 0; i <= 11; i++) {
            hour.push(<li key={i}>{i < 10 ? `0${i}` : i}</li>)
        }

        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size='sm' autoFocus={false} centered={true} >
                <ModalHeader toggle={this.props.toggle}>Set pause interval</ModalHeader>
                <ModalBody>
                    <div className='d-flex justify-content-center interval-selector' style={{ height: '300px' }}>
                        <ul style={{ listStyleType: 'none', fontSize: '2.5rem', width: '50%', padding: 0 }} onScroll={this.scroll}>
                            {hour}
                        </ul>
                        <ul style={{ listStyleType: 'none', fontSize: '2.5rem', width: '50%', padding: 0 }}>
                            {min}
                        </ul>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={this.timer}>Play</Button>
                    <Button color='secondary' onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
