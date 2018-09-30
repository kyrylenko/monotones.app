import React, { Component } from 'react';
import { GlobalPlayPause } from './components/GlobalPlayPause';
//import { RowsView } from './components/RowsView';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    isGlobalPlay: true
  };

  playPause(isGlobalPlay) {
    //console.log("isGlobalPlay: ", isGlobalPlay)
    this.setState({ isGlobalPlay });
  };

  render() {
    return (
      <div className="App">
        <GlobalPlayPause isGlobPlay={this.state.isGlobalPlay} playPause={(m) => this.playPause(m)} />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Monotones</h1>
        </header>
        {this.props.children}
        {/* <RowsView isGlobalPlay={this.state.isGlobalPlay}/> */}
      </div>
    );
  }
}


export default App;