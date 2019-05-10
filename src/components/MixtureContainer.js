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
        {hasActiveSounds && <div className='row'>
            <div className='col-9 col-sm-9 col-md-9 col-lg-9'>
                <span>Playing now</span>
            </div>
            <div className='col-3 col-sm-3 col-md-3 col-lg-3'></div>
        </div>}
        {hasActiveSounds && <MixtureFuture activeSounds={activeSounds} pauseSound={props.pauseSound} saveClick={toggleModal} />}
        {mixtures.length > 0 && <div style={{ marginTop: '25px' }} className='row'>
            <div className='col-9 col-sm-9 col-md-9 col-lg-9'>
                <span>My Mixtures</span>
            </div>
            <div className='col-3 col-sm-3 col-md-3 col-lg-3'></div>
        </div>}
        <CSSTransitionGroup
            transitionName='mixanim'
            transitionEnterTimeout={400}
            transitionLeaveTimeout={400}>
            {mixtures}
        </CSSTransitionGroup>
    </div>
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(MixtureContainer);