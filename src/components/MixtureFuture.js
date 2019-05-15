import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import save from '../assets/icons/save.svg';
import reset from '../assets/icons/reset.svg';
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
            <>
                <div className='pb-2 caption'>Playing now</div>
                <div className='flex-container'>
                    <div className='mixture-block mr-2' style={{ overflow: 'hidden', width: '100%' }}>
                        <CSSTransitionGroup className='flex-container'
                            transitionName='mixanim'
                            transitionEnterTimeout={400}
                            transitionLeaveTimeout={400}>
                            {sounds}
                        </CSSTransitionGroup>
                    </div>
                    <div className='flex-container mixture-actions'>
                        <img className='mixture-img' src={save} title='Save mixture' alt='Save mixture' onClick={this.props.saveClick}></img>
                        <img className='mixture-img' src={reset} title='Reset all' alt='Reset all' onClick={this.props.setSounds}></img>
                    </div>
                </div>
            </>
        );
    }
};

