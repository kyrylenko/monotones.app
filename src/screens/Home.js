import React, { Component } from 'react';
import { RowsView } from '../components/RowsView';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/sounds';
import soundIds from '../constants/soundIds';

class Home extends Component {

    sounds = Object.values(soundIds).map(x => { return { id: x, isPlay: false, volume: 0.1 } });

    componentDidMount() {
        for (let s of this.sounds) {
            let setting = this.props.sounds.find(x => x.id === s.id);

            if (setting !== undefined) {
                //console.log(setting);
                s.isPlay = setting.isPlay;
                s.volume = setting.volume;
            }
        }
    }

    componentDidUpdate() {

    }

    render() {

        console.log("Home this.props.sounds ", this.props.sounds);
        return (
            /* TODO Here should be a logic responsible for different views of sounds page  */
            <RowsView sounds={this.sounds} isGlobalPlay={true} />
        );
    }
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);