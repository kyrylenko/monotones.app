import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import MixtureFuture from './MixtureFuture';
import Mixture from './Mixture';
import { actionCreators } from '../store/mainReducer';

const MixtureContainer = ({ activeSounds, toggleModal, ...props }) => {

    const hasActiveSounds = activeSounds.length > 0;
    const mixtures = (props.mixtures || []).map(({ id, isActive }) => <Mixture title={id} id={id} key={id} isActive={isActive}
        delete={props.deleteMixture}
        deactivate={props.deactivateMixtures}
        switch={props.switchMixture} />)

    return <>
        {hasActiveSounds && <MixtureFuture activeSounds={activeSounds} pauseSound={props.pauseSound} saveClick={toggleModal} />}
        {mixtures.length > 0 && < >
            <div className='pb-2 mt-5 caption'>My Mixtures</div>
            <div className='list-group'>
                <CSSTransitionGroup
                    transitionName='mixanim'
                    transitionEnterTimeout={400}
                    transitionLeaveTimeout={400}>
                    {mixtures}
                </CSSTransitionGroup>
            </div>
        </>}
    </>
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(MixtureContainer);