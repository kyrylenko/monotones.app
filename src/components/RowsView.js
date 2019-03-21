import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import PropTypes from 'prop-types'
import SoundSlider from '../components/SoundSlider';

const RowsView = (props) => {

    const rows = [];

    for (let i = 0; i < props.sounds.length - 1; i += 2) {

        const j = i + 1;
        const sLeft = props.sounds[i];
        const sRight = props.sounds[j];

        const row = <Row key={i} className='sounds-row'>
            <Col lg={2} md={2} sm={2} className='d-none d-sm-block'></Col>
            <Col lg={3} md={3} sm={4} xs={6} className='text-center'>
                <SoundSlider
                    id={sLeft.id}
                    isGlobalPlay={props.isGlobalPlay}
                    isPlay={sLeft.isPlay}
                    isLoaded={sLeft.isLoaded}
                    volume={sLeft.volume}
                    title={sLeft.id}
                    playPauseVolume={props.playPauseVolume} />
            </Col>
            <Col lg={2} md={2} sm={2} className='d-none d-sm-none d-md-block'></Col>
            <Col lg={3} md={3} sm={4} xs={6} className='text-center'>
                <SoundSlider
                    id={sRight.id}
                    isGlobalPlay={props.isGlobalPlay}
                    isPlay={sRight.isPlay}
                    isLoaded={sRight.isLoaded}
                    volume={sRight.volume}
                    title={sRight.id}
                    playPauseVolume={props.playPauseVolume} />
            </Col>
            <Col lg={2} md={2} sm={2} className='d-none d-sm-block'></Col>
        </Row>;

        rows.push(row);
    }

    return (
        <Container>
            {rows}
        </Container>
    );

}

RowsView.propTypes = {
    playPauseVolume: PropTypes.func.isRequired,
    isGlobalPlay: PropTypes.bool.isRequired,
    sounds: PropTypes.array.isRequired
}

export default RowsView;