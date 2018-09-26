import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { SoundSlider } from './components/SoundSlider';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    //this.url = 'http://streaming.tdiradio.com:8000/house.mp3'
    //this.url = require('./assets/sounds/bleu_whales.mp3')
    this.url = require('./assets/sounds/deep_space.mp3')
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
        <Container>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <img alt="Rain" className="sound sound-left" data-element="sound" data-name="rain" src={require('./assets/icons/bleu-whales.png')} title="Rain" style={{ opacity: 1 }}></img>
              <div className="to-left ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" data-element="volume_slider" data-element-name="rain_slider" style={{ display: 'block' }}>
                <span className="ui-slider-handle ui-state-default ui-corner-all" style={{ flex: 0.6 }}></span>
              </div>
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <audio controls loop>
                <source src={require('./assets/sounds/deep_space.ogg')} type="audio/ogg"></source>
              </audio>
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
          </Row>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <audio controls loop>
                <source src={require('./assets/sounds/bleu_whales.mp3')} type="audio/ogg"></source>
              </audio>
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <audio controls loop>
                <source src={require('./assets/sounds/deep_space.ogg')} type="audio/ogg"></source>
              </audio>
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
          </Row>
        </Container>

        <button onClick={() => this.play()}>Play</button>
        <button onClick={() => this.pause()}>Pause</button>
      </div>
    );
  }
}

export default App;