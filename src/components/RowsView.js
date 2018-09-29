import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap'; //https://github.com/react-bootstrap/react-bootstrap
import { SoundSlider } from '../components/SoundSlider';
import '../App.css';

export class RowsView extends Component {

    render() {
        return (
            <Container>
                <Row>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'summer_day'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Summer day" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'summer_night'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Summer night" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                </Row>
                <Row>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'thunderstorm'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Thunderstorm" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'wind_chimes'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Wind chimes" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                </Row>
                <Row>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'sailing_yacht'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Sailing yacht" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'blue_whales'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Bleu whales" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                </Row>
                <Row>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'campfire'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Campfire" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'farm'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Farm" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                </Row>
                <Row>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'deep_space'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Deep space" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'inside_train'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Inside train" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                </Row>
                <Row>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'river_stream'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="River stream" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'seawaves'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Seawaves" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                </Row>
                <Row>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'october_rain'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="October rain" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs hidden-sm"></Col>
                    <Col lg={3} md={3} sm={4} xs={6} className="text-center">
                        <SoundSlider id={'paris_cafe'} isGlobalPlay={this.props.isGlobalPlay} isPlay={false} title="Paris cafe" />
                    </Col>
                    <Col lg={2} md={2} sm={2} className="hidden-xs"></Col>
                </Row>
            </Container>
        );
    }
}