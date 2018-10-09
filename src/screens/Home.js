import React, { Component } from 'react';
import { RowsView } from '../components/RowsView';
import { GlobalPlayPause } from '../components/GlobalPlayPause';
import MixtureFuture from '../components/MixtureFuture';
import Mixture from '../components/Mixture';
import { SaveMixtureModal } from '../components/Modals';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/sounds';
import soundIds from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';

import { Container, Row, Col } from 'reactstrap';

class Home extends Component {

    //sounds = Object.values(soundIds).map(x => { return { id: x, isPlay: false, volume: 0.1 } });

    state = {
        isGlobalPlay: false,
        modalIsOpen: false
    };

    toggleModal = () => {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen
        });
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
    };

    switchMixture = (id) => {
        if (!this.state.isGlobalPlay) {
            this.globalPlayPause(true);
        }
        this.props.switchMixture(id);
    };

    deactivateMixtures = () => {
        if (this.state.isGlobalPlay) {
            this.globalPlayPause(false);
        }
        this.props.deactivateMixtures();
    };

    aggregateSounds = () => {
        let aggregate = Object.values(soundIds).map(x => {
            let setting = this.props.sounds.find(s => s.id === x);
            let hasSetting = setting !== undefined;

            return {
                id: x,
                isPlay: hasSetting ? setting.isPlay : false,
                volume: hasSetting ? setting.volume : defaultValues.defaultVolume
            };
        });

        return aggregate;
    }

    render() {
        //let hasActiveSounds = this.props.sounds.some(s => s.isPlay);
        let activeSounds = this.props.sounds.filter(s => s.isPlay);
        //console.log("Home this.props ", this.props);
        //key={this.state.isGlobalPlay ? null : this.props.lastUpdatedId}
        let mixtures = (this.props.mixtures || []).map(x => <Mixture title={x.id} id={x.id} key={x.id} isActive={x.isActive}
            delete={this.props.deleteMixture}
            deactivate={this.deactivateMixtures}
            switch={this.switchMixture} />)

        return (
            <div>
                {activeSounds.length > 0 && <GlobalPlayPause isGlobPlay={this.state.isGlobalPlay} playPause={(m) => this.globalPlayPause(m)} />}
                <Container fluid className="mixtures-div d-none d-md-block">
                    {activeSounds.length > 0 && <Row>
                        <Col lg={9} md={9} sm={9} xs={9}>
                            <span className='white-text'>Playing now</span>
                        </Col>
                        <Col lg={3} md={3} sm={3} xs={3}></Col>
                    </Row>}
                    {activeSounds.length > 0 && <MixtureFuture activeSounds={activeSounds} pauseSound={this.props.pauseSound} saveClick={this.toggleModal} />}
                    {mixtures.length > 0 && <Row style={{ marginTop: '25px' }}>
                        <Col lg={9} md={9} sm={9} xs={9}>
                            <span className='white-text'>My Mixtures</span>
                        </Col>
                        <Col lg={3} md={3} sm={3} xs={3}></Col>
                    </Row>}
                    {mixtures}
                </Container>
                <RowsView sounds={this.aggregateSounds()} playPauseVolume={this.playPauseVolume} isGlobalPlay={this.state.isGlobalPlay} />
                <SaveMixtureModal isOpen={this.state.modalIsOpen} toggle={this.toggleModal} save={this.props.addMixture} />
            </div>
            /* TODO Here should be a logic responsible for different views of sounds page  */
        );
    }
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);