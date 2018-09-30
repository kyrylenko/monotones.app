import React, { Component } from 'react';
import { RowsView } from '../components/RowsView';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/sounds';

class Home extends Component {
    render() {
        console.log("Home this.props ", this.props);
        return (
            /* TODO Here should be a logic responsible for different views of sounds page  */
            <RowsView />
            /* <RowsView isGlobalPlay={this.state.isGlobalPlay} /> */
        );
    }
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
  )(Home);