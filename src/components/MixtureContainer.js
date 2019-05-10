import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import MixtureFuture from './MixtureFuture';

const MixtureContainer = ({ mixtures, activeSounds, pauseSound, toggleModal }) => {

    const hasActiveSounds = activeSounds.length > 0;

    return <div className='mixtures-div d-none d-md-block container-fluid'>
        {hasActiveSounds && <div className='row'>
            <div className='col-9 col-sm-9 col-md-9 col-lg-9'>
                <span>Playing now</span>
            </div>
            <div className='col-3 col-sm-3 col-md-3 col-lg-3'></div>
        </div>}
        {hasActiveSounds && <MixtureFuture activeSounds={activeSounds} pauseSound={pauseSound} saveClick={toggleModal} />}
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

export default MixtureContainer;