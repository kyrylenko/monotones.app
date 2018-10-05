import React, { Component } from 'react';
import { RowsView } from '../components/RowsView';
import { GlobalPlayPause } from '../components/GlobalPlayPause';
import MixtureFuture from '../components/MixtureFuture';
import Mixture from '../components/Mixture';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/sounds';
import soundIds from '../constants/soundIds';

import { Container } from 'react-bootstrap';

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
        //let hasActiveSounds = this.props.sounds.some(s => s.isPlay);
        let activeSounds = this.props.sounds.filter(s => s.isPlay);
        console.log("Home activeSounds ", activeSounds);
        //console.log("Home this.props ", this.props);
        //key={this.state.isGlobalPlay ? null : this.props.lastUpdatedId}   
                
        return (
            <div>
                {activeSounds.length > 0 && <GlobalPlayPause isGlobPlay={this.state.isGlobalPlay} playPause={(m) => this.globalPlayPause(m)} />}
                <div className="mixtures-div">
                    <Container fluid>
                        {activeSounds.length > 0 && <MixtureFuture activeSounds={activeSounds}/>}
                        <Mixture name='Mixture lolo' id={22} isActive={false}/>
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