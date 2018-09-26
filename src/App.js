import React, { Component } from 'react';
import { SoundSlider } from './components/SoundSlider';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    //this.url = 'http://streaming.tdiradio.com:8000/house.mp3'
    //this.url = require('./assets/bleu_whales.mp3')
    this.url = require('./assets/deep_space.mp3')
    this.stream = new Audio(this.url);
    //this.stream.loop = true;
    this.stream.preload = 'none';

    this.stream.addEventListener('timeupdate', function () {
      var buffer = .44
      if (this.currentTime > this.duration - buffer) {
        this.currentTime = 0
        this.play()
      }
    }, false);
  }

  play = () => {
    console.log("plat click");
    this.stream.play();
  }

  pause = () => {
    this.stream.pause();
    this.stream.src = ''
    this.stream.load();

    this.stream = null;

    this.stream = new Audio();
    this.stream.src = this.url;
    this.stream.preload = 'none';
    this.stream.pause();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <audio controls loop>
          <source src={require('./assets/bleu_whales.mp3')} type="audio/ogg"></source>
        </audio>
        <audio controls loop>
          <source src={require('./assets/deep_space.ogg')} type="audio/ogg"></source>
        </audio>

        <button onClick={() => this.play()}>Play</button>
        <button onClick={() => this.pause()}>Pause</button>
      </div>
    );
  }
}

export default App;