import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import save from '../assets/icons/save.svg'
import { StringUtils } from '../utils/StringUtils'

const utils = new StringUtils();

export default class MixtureFuture extends Component {

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
            <div style={{ marginTop: '5px' }} className='row'>
                <div className='mixture-block col-9 col-sm-9 col-md-9 col-lg-9' style={{ overflow: 'hidden' }}>
                    <CSSTransitionGroup className='flex-container'
                        transitionName='mixanim'
                        transitionEnterTimeout={400}
                        transitionLeaveTimeout={400}>
                        {sounds}
                    </CSSTransitionGroup>
                </div>
                <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                    <img className='mixture-img' src={save} title='Save mixture' alt='Save mixture' onClick={this.props.saveClick}></img>
                </div>
            </div>
        );
    }
};

