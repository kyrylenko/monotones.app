import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import save from '../assets/icons/save.svg'

export default class MixtureFuture extends Component {

    render() {

        let sounds = this.props.activeSounds.map(x =>
            <div className="mixture-item" key={x.id}>
                <img
                    className="mixture-img"
                    src={require(`../assets/icons/white/${x.id}.png`)}
                    id={x.id}
                    alt={x.id}
                    title={x.id}
                    onClick={() => this.props.pauseSound(x.id)}></img>
            </div>);

        return (
            <Row style={{ marginTop: '5px' }}>
                <Col lg={9} md={9} sm={9} xs={9} className="mixture-block flex-container" style={{ overflow: 'hidden' }}>
                    {sounds}
                </Col>
                <Col lg={3} md={3} sm={3} xs={3}>
                    <img className="mixture-img" src={save} title='Save mixture' alt='Save mixture' onClick={this.props.saveClick}></img>
                </Col>
            </Row>
        );
    }
};

