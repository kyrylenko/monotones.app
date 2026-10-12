import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TransitionGroup } from 'react-transition-group';
import MixAnim from './MixAnim';
import MixtureFuture from './MixtureFuture';
import Mixture from './Mixture';
import { actionCreators } from '../store/mainReducer';

const MixtureContainer = ({ activeSounds, toggleModal, ...props }) => {

    const { t } = useTranslation();
    const hasActiveSounds = activeSounds.length > 0;
    const mixtures = (props.mixtures || []).map(({ id, isActive }) => <MixAnim key={id}>
        <Mixture title={id} id={id} isActive={isActive}
            delete={props.deleteMixture}
            deactivate={props.deactivateMixtures}
            switch={props.switchMixture} />
    </MixAnim>)

    return <>
        {hasActiveSounds && <MixtureFuture
            activeSounds={activeSounds}
            pauseSound={props.pauseSound}
            saveClick={toggleModal}
            setSounds={() => props.setSounds([])} />}
        {mixtures.length > 0 && <div className='mixtures card mt-5'>
            <div className='card-header'>{t('my_mixtures')}</div>
            <div className='list-group'>
                <TransitionGroup>
                    {mixtures}
                </TransitionGroup>
            </div>
        </div>}
    </>
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(MixtureContainer);