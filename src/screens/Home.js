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

import { Container } from 'reactstrap';

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
        //let hasActiveSounds = this.props.sounds.some(s => s.isPlay);
        let activeSounds = this.props.sounds.filter(s => s.isPlay);
        console.log("Home this.props ", this.props);
        //key={this.state.isGlobalPlay ? null : this.props.lastUpdatedId}
        let mixtures = this.props.mixtures.map(x => <Mixture title={x.id} id={x.id} key={x.id} isActive={x.isActive}
            delete={this.props.deleteMixture}
            switch={this.switchMixture} />)

        return (
            <div>
                {activeSounds.length > 0 && <GlobalPlayPause isGlobPlay={this.state.isGlobalPlay} playPause={(m) => this.globalPlayPause(m)} />}
                <div className="mixtures-div">
                    <Container fluid>
                        {activeSounds.length > 0 && <MixtureFuture activeSounds={activeSounds} pauseSound={this.props.pauseSound} saveClick={this.toggleModal} />}
                        {mixtures}
                    </Container>
                </div>
                <RowsView sounds={this.aggregateSounds()} playPauseVolume={this.playPauseVolume} isGlobalPlay={this.state.isGlobalPlay} />
                <SaveMixtureModal isOpen={this.state.modalIsOpen} toggle={this.toggleModal} save={this.props.addMixture} autoFocus={false} />
            </div>
            /* TODO Here should be a logic responsible for different views of sounds page  */
        );
    }
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);