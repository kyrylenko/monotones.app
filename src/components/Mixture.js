import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

export default class Mixture extends Component {
    render() {
        return (
            <Row style={{ marginTop: '5px' }}>
                <Col lg={9} md={9} sm={9} className="mixture-block col-xs-9 flex-container mixture-action-btn" style={{ minHeight: '42px', justifyContent: 'center' }}>
                    <span>{this.props.name}</span>
                </Col>
                <Col lg={3} md={3} sm={3} className="col-xs-3">
                    <img className="mixture-img mixture-action-btn" src={require('../assets/icons/play.png')}></img>
                </Col>
            </Row>
        );
    }
};

