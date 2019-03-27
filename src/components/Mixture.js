import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import colors from '../constants/colors';
import trash from '../assets/icons/trash.svg';

export default class Mixture extends Component {
    render() {
        return (
            <Row style={{ marginTop: '5px' }} className='mixture-row'>
                <Col lg={9} md={9} sm={9} xs={9}                    
                    className= 'mixture-block mixture-block-selectable flex-container mixture-action-btn'
                    style={{ minHeight: '42px', justifyContent: 'center', backgroundColor: this.props.isActive ? colors.themeActive : colors.theme }}
                    title = {this.props.isActive ? 'Pause mixture': 'Play mixture'}
                    onClick={this.props.isActive ? () => this.props.deactivate() : () => this.props.switch(this.props.id)}>
                    <span>{this.props.title}</span>
                </Col>
                <Col lg={3} md={3} sm={3} xs={3}>
                    <img onClick={() => this.props.delete(this.props.id)} className="mixture-img mixture-action-btn" src={trash} title='Delete mixture' alt='Delete mixture'></img>
                </Col>
            </Row>
        );
    }
};

