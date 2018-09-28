import React, { Component } from 'react';
import '../App.css';

export class GlobalMuter extends Component {

    clickHandler() {
        this.props.mute(!this.props.isMuted);
    };

    render() {
        return (
            <div className="mute-div">
                <img onClick={() => this.clickHandler(this.props.isMuted)}
                    alt={this.props.isMuted ? "Unute" : "Mute"}
                    src={this.props.isMuted ? require('../assets/icons/mute.png') : require('../assets/icons/unmute.png')}
                    style={{ opacity: this.props.isMuted ? 1 : null }} title={this.props.isMuted ? "Unute" : "Mute"}>
                </img>
            </div>
        );
    }
}