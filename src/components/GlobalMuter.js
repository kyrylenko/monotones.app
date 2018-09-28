import React, { Component } from 'react';
import '../App.css';

export class GlobalMuter extends Component {

    muteClickHandler() {
        this.props.mute(true);
    };

    unmuteClickHandler() {
        this.props.mute(false);
    };

    render() {
        return (
            <div className="mute-div">
                <ul className="mute-header">
                    <li onClick={() => this.muteClickHandler()}>
                        <img alt="Mute" src={require('../assets/icons/unmute.png')} style={{ opacity: 0.5, display: this.props.isMuted ? 'none': 'block' }} title="Mute"></img>
                    </li>
                    <li onClick={() => this.unmuteClickHandler()}>
                        <img alt="Unmute" src={require('../assets/icons/mute.png')} style={{ opacity: 0.5, display: this.props.isMuted ? 'block' : 'none' }} title="Unmute"></img>
                    </li>
                </ul>
            </div>
        );
    }
}