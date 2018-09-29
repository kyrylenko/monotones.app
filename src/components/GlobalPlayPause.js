import React, { Component } from 'react';
import '../App.css';

export class GlobalPlayPause extends Component {

    clickHandler() {
        this.props.playPause(!this.props.isGlobPlay);
    };

    render() {
        return (
            <div className="mute-div">
                <img onClick={() => this.clickHandler(this.props.isGlobPlay)}
                    alt={this.props.isGlobPlay ? "Play" : "Pause"}
                    src={this.props.isGlobPlay ? require('../assets/icons/mute.png') : require('../assets/icons/unmute.png')}
                    style={{ opacity: this.props.isGlobPlay ? 1 : null }} title={this.props.isGlobPlay ? "Play" : "Pause"}>
                </img>
            </div>
        );
    }
}