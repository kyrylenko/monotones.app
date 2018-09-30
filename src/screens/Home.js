import React, { Component } from 'react';
import { RowsView } from '../components/RowsView';

class Home extends Component {
    render() {
        return (
            /* TODO Here should be a logic responsible for different views of sounds page  */
            <RowsView />
            /* <RowsView isGlobalPlay={this.state.isGlobalPlay} /> */
        );
    }
};

export default Home;