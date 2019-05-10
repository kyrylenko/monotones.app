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

    return <div className='mixtures-div container-fluid'>
        {hasActiveSounds && <MixtureFuture activeSounds={activeSounds} pauseSound={props.pauseSound} saveClick={toggleModal} />}
        {mixtures.length > 0 && <div style={{ marginTop: '25px' }} className='row'>
            <div className='col-md-3 ml-md-auto'>
                <div className='pb-2 caption'>My Mixtures</div>
                <div className='list-group'>
                    <CSSTransitionGroup
                        transitionName='mixanim'
                        transitionEnterTimeout={400}
                        transitionLeaveTimeout={400}>
                        {mixtures}
                    </CSSTransitionGroup>
                </div>
            </div>
        </div>}
    </div>
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(MixtureContainer);