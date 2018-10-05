import React, { Component } from 'react';
import { RowsView } from '../components/RowsView';
import { GlobalPlayPause } from '../components/GlobalPlayPause';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/sounds';
import soundIds from '../constants/soundIds';

import { Col, Container, Row } from 'react-bootstrap';

class Home extends Component {

    //sounds = Object.values(soundIds).map(x => { return { id: x, isPlay: false, volume: 0.1 } });

    state = {
        isGlobalPlay: false
    };

    globalPlayPause = (isGlobalPlay) => {
        this.setState({ isGlobalPlay });
    };

    playPauseVolume = (sound) => {
        //console.log('playPauseVolume, sound ', sound);
        if (!this.state.isGlobalPlay && sound.isPlay) {
            this.globalPlayPause(true);
        }
        this.props.playPauseVolume(sound);
    }

    aggregateSounds = () => {

        let aggregate = Object.values(soundIds).map(x => {
            let setting = this.props.sounds.find(s => s.id === x);
            let hasSetting = setting !== undefined;

            return {
                id: x,
                isPlay: hasSetting ? setting.isPlay : false,
                volume: hasSetting ? setting.volume : 0.1
            };
        });

        return aggregate;
    }

    render() {
        let hasActiveSounds = this.props.sounds.some(s => s.isPlay);
        //console.log("Home this.props ", this.props);
        //key={this.state.isGlobalPlay ? null : this.props.lastUpdatedId}                
        return (
            <div>
                {hasActiveSounds && <GlobalPlayPause isGlobPlay={this.state.isGlobalPlay} playPause={(m) => this.globalPlayPause(m)} />}
                <div className="mixtures-div">
                    <Container fluid>
                        <Row style={{ marginTop: '5px' }}>
                            <Col lg={9} md={9} sm={9} className="mixture-block col-xs-9 flex-container" style={{ overflow: 'hidden' }}>
                                <div className="mixture-item"><img className="mixture-img" src={require('../assets/icons/white/birds_in_park.png')} alt=''></img></div>
                                <div className="mixture-item"><img className="mixture-img" src={require('../assets/icons/white/city_street.png')} alt=''></img></div>
                                <div className="mixture-item"><img className="mixture-img" src={require('../assets/icons/white/wind_chimes.png')} alt=''></img></div>
                                <div className="mixture-item"><img className="mixture-img" src={require('../assets/icons/white/campfire.png')} alt=''></img></div>
                            </Col>
                            <Col lg={3} md={3} sm={3} className="col-xs-3">
                                <img className="mixture-img" src={require('../assets/icons/pause.png')}></img>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '5px' }}>
                            <Col lg={9} md={9} sm={9} className="mixture-block col-xs-9" style={{ textAlign: 'center', minHeight: '42px', lineHeight: '42px' }}>
                                <span>Mixture name</span>
                            </Col>
                            <Col lg={3} md={3} sm={3} className="col-xs-3">
                                <img className="mixture-img mixture-action-btn" src={require('../assets/icons/play.png')}></img>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '5px' }}>
                            <Col lg={9} md={9} sm={9} className="mixture-block col-xs-9 flex-container" style={{ minHeight: '42px' }}>
                                <span>Mixture name</span>
                            </Col>
                            <Col lg={3} md={3} sm={3} className="col-xs-3">
                                <img className="mixture-img mixture-action-btn" src={require('../assets/icons/play.png')}></img>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <RowsView sounds={this.aggregateSounds()} playPauseVolume={this.playPauseVolume} isGlobalPlay={this.state.isGlobalPlay} />
            </div>
            /* TODO Here should be a logic responsible for different views of sounds page  */
        );
    }
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);