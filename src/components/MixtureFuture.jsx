import React, { Component } from 'react';
import { TransitionGroup } from 'react-transition-group';
import MixAnim from './MixAnim';
import { iconUrl } from '../assets';
import { withTranslation } from 'react-i18next';
import save from '../assets/icons/save.svg';
import reset from '../assets/icons/reset.svg';
import utils from '../utils/StringUtils';

class MixtureFuture extends Component {

    render() {
        const { t } = this.props;

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
            <>
                <div className='pb-2 caption'>{t('playing_now')}</div>
                <div className='flex-container'>
                    <div className='mixture-block me-2' style={{ overflow: 'hidden', width: '100%' }}>
                        <TransitionGroup className='flex-container'>
                            {sounds}
                        </TransitionGroup>
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
