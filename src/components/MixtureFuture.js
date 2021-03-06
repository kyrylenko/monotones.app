import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { withTranslation } from 'react-i18next';
import save from '../assets/icons/save.svg';
import reset from '../assets/icons/reset.svg';
import utils from '../utils/StringUtils';

class MixtureFuture extends Component {

    render() {
        const { t } = this.props;

        const sounds = this.props.activeSounds.map(x =>
            <div className='mixture-item' key={x.id}>
                <img
                    className='mixture-img'
                    src={require(`../assets/icons/white/${x.id}.webp`)}
                    id={x.id}
                    alt={x.id}
                    title={`${utils.idToTitle(x.id)} - Pause`}
                    onClick={() => this.props.pauseSound(x.id)}></img>
            </div>);

        return (
            <>
                <div className='pb-2 caption'>{t('playing_now')}</div>
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
                        <img className='mixture-img' src={save} title={t('save_mixture')} alt={t('save_mixture')} onClick={this.props.saveClick}></img>
                        <img className='mixture-img' src={reset} title='Reset all' alt='Reset all' onClick={this.props.setSounds}></img>
                    </div>
                </div>
            </>
        );
    }
};

export default withTranslation()(MixtureFuture);
