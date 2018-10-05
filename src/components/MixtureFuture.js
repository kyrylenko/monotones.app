import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

export default class MixtureFuture extends Component {
    render() {

        let sounds = this.props.activeSounds.map(x =>
            <div className="mixture-item" key={x.id}>
                <img className="mixture-img" src={require(`../assets/icons/white/${x.id}.png`)} id={x.id} alt={x.id}></img>
            </div>);

        return (
            <Row style={{ marginTop: '5px' }}>
                <Col lg={9} md={9} sm={9} className="mixture-block col-xs-9 flex-container" style={{ overflow: 'hidden' }}>
                    {sounds}
                </Col>
                <Col lg={3} md={3} sm={3} className="col-xs-3">
                    <img className="mixture-img" src={require('../assets/icons/pause.png')}></img>
                </Col>
            </Row>
        );
    }
};

