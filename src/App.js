import React, { Component } from 'react';
import { GlobalMuter } from './components/GlobalMuter';
import { RowsView } from './components/RowsView';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    isMute: false
  };

  mute(isMute) {
    //console.log("isMute: ", isMute)
    this.setState({ isMute });
  };

  render() {
    return (
      <div className="App">
        <GlobalMuter isMuted={this.state.isMute} mute={(m) => this.mute(m)} />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Monotones</h1>
        </header>
        <RowsView mute={this.state.isMute}/>

        {/*<audio controls loop>
          <source src={require('./assets/sounds/bleu_whales.mp3')} type="audio/ogg"></source>
        </audio> */}
      </div>
    );
  }
}


export default App;