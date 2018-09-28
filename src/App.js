import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap'; //https://github.com/react-bootstrap/react-bootstrap
import { SoundSlider } from './components/SoundSlider';
import { GlobalMuter } from './components/GlobalMuter';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    isMute: false
  };

  mute(isMute) {
    console.log("isMute: ", isMute)
    this.setState({ isMute });
  };

  render() {
    return (
      <div className="App">

        <GlobalMuter isMuted={this.state.isMute} mute={(m)=> this.mute(m)} />

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Monotones</h1>
        </header>
        <Container>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider mute={this.state.isMute} src={require('./assets/icons/white/summer-day.png')} sound={require('./assets/sounds/summer_day.mp3')} enabled={false} title="Summer day" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider mute={this.state.isMute} src={require('./assets/icons/white/summer-night.png')} sound={require('./assets/sounds/summer_night.mp3')} enabled={false} title="Summer night" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
          </Row>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/thunderstorm.png')} sound={require('./assets/sounds/thunderstorm.mp3')} enabled={false} title="Thunderstorm" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/wind-chimes.png')} sound={require('./assets/sounds/wind_chimes.mp3')} enabled={false} title="Wind chimes" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
          </Row>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/sailing-yacht.png')} sound={require('./assets/sounds/sailing_yacht.mp3')} enabled={false} title="Sailing yacht" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/blue-whales.png')} sound={require('./assets/sounds/bleu_whales.mp3')} enabled={false} title="Bleu whales" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
          </Row>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/campfire.png')} sound={require('./assets/sounds/campfire.mp3')} enabled={false} title="Campfire" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/farm.png')} sound={require('./assets/sounds/farm.mp3')} enabled={false} title="Farm" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
          </Row>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/deep-space.png')} sound={require('./assets/sounds/deep_space.mp3')} enabled={false} title="Deep space" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/inside-train.png')} sound={require('./assets/sounds/inside_train.mp3')} enabled={false} title="Inside train" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
          </Row>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/river-stream.png')} sound={require('./assets/sounds/river_stream.mp3')} enabled={false} title="River stream" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/seawaves.png')} sound={require('./assets/sounds/seawaves.mp3')} enabled={false} title="Seawaves" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
          </Row>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/october-rain.png')} sound={require('./assets/sounds/october_rain.mp3')} enabled={false} title="October rain" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/white/paris-cafe.png')} sound={require('./assets/sounds/paris_cafe.mp3')} enabled={false} title="Paris cafe" />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
          </Row>
        </Container>

        {/*         <audio controls loop>
          <source src={require('./assets/sounds/bleu_whales.mp3')} type="audio/ogg"></source>
        </audio> */}
      </div>
    );
  }
}


export default App;