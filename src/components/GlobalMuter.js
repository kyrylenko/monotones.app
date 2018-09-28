import React, { Component } from 'react';
import '../App.css';

export class GlobalMuter extends Component {

    clickHandler() {
        this.props.mute(!this.props.isMuted);
    };

    render() {
        return (
            <div className="mute-div">
                <ul className="mute-header">
                    <li onClick={() => this.clickHandler(this.props.isMuted)}>
                        <img alt={this.props.isMuted ? "Unute" : "Mute"}
                            src={this.props.isMuted ? require('../assets/icons/mute.png') : require('../assets/icons/unmute.png')}
                            style={{ opacity: 0.5 }} title={this.props.isMuted ? "Unute" : "Mute"}>
                        </img>
                    </li>
                </ul>
            </div>
        );
    }
}