import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import save from '../assets/icons/save.svg';
import utils from '../utils/StringUtils';

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
                <div className='col-md-3 ml-md-auto'>
                    <div className='pb-2 caption'>Playing now</div>
                    <div className='flex-container'>
                        <div className='mixture-block col-9' style={{ overflow: 'hidden' }}>
                            <CSSTransitionGroup className='flex-container'
                                transitionName='mixanim'
                                transitionEnterTimeout={400}
                                transitionLeaveTimeout={400}>
                                {sounds}
                            </CSSTransitionGroup>
                        </div>
                        <div className='col-3'>
                            <img className='mixture-img' src={save} title='Save mixture' alt='Save mixture' onClick={this.props.saveClick}></img>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
};

