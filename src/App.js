import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { SoundSlider } from './components/SoundSlider';

import logo from './logo.svg';
import './App.css';

class App extends Component {


  render() {
    return (

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Monotones</h1>
        </header>
        <Container>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/deep-space.png')} sound={require('./assets/sounds/deep_space.ogg')} enabled={false} />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/bleu-whales.png')} sound={require('./assets/sounds/bleu_whales.mp3')} enabled={false} />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
          </Row>
          <Row>
            <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/campfire.png')} sound={require('./assets/sounds/campfire.mp3')} enabled={true} />
            </Col>
            <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
            <Col lg={3} md={3} sm={4} xs={6} className="text-center">
              <SoundSlider src={require('./assets/icons/farm.png')} sound={require('./assets/sounds/farm.ogg')} enabled={false} />
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