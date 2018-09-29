import React, { Component } from 'react';
import '../App.css';

export class GlobalPlayPause extends Component {

    clickHandler() {
        this.props.playPause(!this.props.isGlobPlay);
    };

    render() {
        return (
            <div className="play-div">
                <img onClick={() => this.clickHandler(this.props.isGlobPlay)}
                    alt={this.props.isGlobPlay ? "Pause" : "Play"}
                    src={this.props.isGlobPlay ? require('../assets/icons/unmute.png') : require('../assets/icons/mute.png')}
                    style={{ opacity: this.props.isGlobPlay ? 1 : null }} title={this.props.isGlobPlay ? "Pause" : "Play"}>
                </img>
            </div>
        );
    }
}