import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { StringUtils } from '../utils/StringUtils'
import colors from '../constants/colors';

const utils = new StringUtils();

export default class PlayingNow extends Component {

    render() {
        const sounds = this.props.activeSounds.map(x =>
            <div className='mixture-item' key={x.id}>
                <img
                    className='mixture-img'
                    src={require(`../assets/icons/white/${x.id}.png`)}
                    id={x.id}
                    alt={x.id}
                    title={`${utils.idToTitle(x.id)} - Pause`}
                    onClick={() => this.props.pauseSound(x.id)}></img>
            </div>);

        return (
            <div className='container-fluid'>
                <div style={{ marginTop: '5px' }} className='row'>
                    <div style={{ overflow: 'hidden', backgroundColor: colors.themeActive }} className='col'>
                        <CSSTransitionGroup className='d-flex justify-content-center'
                            transitionName='mixanim'
                            transitionEnterTimeout={400}
                            transitionLeaveTimeout={400}>
                            {sounds}
                        </CSSTransitionGroup>
                    </div>
                </div>
            </div>

        );
    }
};

