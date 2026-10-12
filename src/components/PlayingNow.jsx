import React, { Component } from 'react';
import { TransitionGroup } from 'react-transition-group';
import MixAnim from './MixAnim';
import { iconUrl } from '../assets';
import utils from '../utils/StringUtils';
import colors from '../constants/colors';

export default class PlayingNow extends Component {

    render() {                
        const sounds = this.props.activeSounds.map(x =>
            <MixAnim key={x.id}><div className='mixture-item'>
                <img
                    className='mixture-img'
                    src={iconUrl(x.id)}
                    id={x.id}
                    alt={x.id}
                    title={`${utils.idToTitle(x.id)} - Pause`}
                    onClick={() => this.props.pauseSound(x.id)}></img>
            </div></MixAnim>);

        return (
            <div className='container-fluid'>
                <div style={{ marginTop: '5px' }} className='row'>
                    <div style={{ overflow: 'hidden', backgroundColor: colors.themeActive }} className='col'>
                        <TransitionGroup className='d-flex justify-content-center'>
                            {sounds}
                        </TransitionGroup>
                    </div>
                </div>
            </div>

        );
    }
};

