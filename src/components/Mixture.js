import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import colors from '../constants/colors'

export default class Mixture extends Component {
    render() {
        return (
            <Row style={{ marginTop: '5px' }} className='mixture-row'>
                <Col lg={9} md={9} sm={9} xs={9}                    
                    className= {'mixture-block mixture-block-selectable flex-container white-text ' + (this.props.isActive ? null : 'mixture-action-btn')}                    
                    style={{ minHeight: '42px', justifyContent: 'center', backgroundColor: this.props.isActive ? colors.themeActive : colors.theme }}
                    onClick={() => this.props.switch(this.props.id)}>
                    <span>{this.props.title}</span>
                </Col>
                <Col lg={3} md={3} sm={3} xs={3}>
                    <img onClick={() => this.props.delete(this.props.id)} className="mixture-img mixture-action-btn" src={require('../assets/icons/play.png')} title='Delete mixture' alt='Delete mixture'></img>
                </Col>
            </Row>
        );
    }
};

