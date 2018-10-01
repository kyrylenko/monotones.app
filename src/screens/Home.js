import React, { Component } from 'react';
import { RowsView } from '../components/RowsView';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/sounds';
import soundIds from '../constants/soundIds';

class Home extends Component {

    //sounds = Object.values(soundIds).map(x => { return { id: x, isPlay: false, volume: 0.1 } });

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

        console.log("Home this.props ", this.props);
        return (
            /* TODO Here should be a logic responsible for different views of sounds page  */
            <RowsView sounds={this.aggregateSounds()} playPauseVolume={this.props.playPauseVolume} isGlobalPlay={true} />
        );
    }
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);