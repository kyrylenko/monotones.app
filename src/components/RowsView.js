import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap'; //https://github.com/react-bootstrap/react-bootstrap
import PropTypes from 'prop-types'
import { SoundSlider } from '../components/SoundSlider';

import '../App.css';

export class RowsView extends Component {

    //isOdd(num) { return (num % 2) === 1; }

    render() {
        //console.log("RowsView props ", this.props);

        let elements = [];

        for (let i = 0; i < this.props.sounds.length - 1; i += 2) {

            let j = i + 1;
            let sLeft = this.props.sounds[i];
            let sRight = this.props.sounds[j];

            let row = <Row key={i}>
                <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                    <SoundSlider
                        id={sLeft.id}
                        isGlobalPlay={this.props.isGlobalPlay}
                        isPlay={sLeft.isPlay}
                        volume={sLeft.volume}
                        title={sLeft.id}
                        playPauseVolume={this.props.playPauseVolume} />
                </Col>
                <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
                <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                    <SoundSlider
                        id={sRight.id}
                        isGlobalPlay={this.props.isGlobalPlay}
                        isPlay={sRight.isPlay}
                        volume={sRight.volume}
                        title={sRight.id}
                        playPauseVolume={this.props.playPauseVolume} />
                </Col>
                <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            </Row>;

            elements.push(row);
        }

        return (
            <Container>                            
                {elements}
            </Container>
        );
    }
}

RowsView.propTypes = {
    playPauseVolume: PropTypes.func.isRequired,
    isGlobalPlay: PropTypes.bool.isRequired,
    sounds: PropTypes.array.isRequired
  }