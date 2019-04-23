import React, { Component } from 'react';
import RowsView from '../components/RowsView';
import { CSSTransitionGroup } from 'react-transition-group';
import MixtureFuture from '../components/MixtureFuture';
import PlayingNow from '../components/PlayingNow';
import Mixture from '../components/Mixture';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as mainActions } from '../store/mainReducer';
import { actionCreators as timerActions } from '../store/timerReducer';
import TimerControl from '../components/TimerControl';
import Affix from '../components/Affix';
const SaveMixtureModal = React.lazy(() => import('../components/Modals'));
const TimerModal = React.lazy(() => import('../components/TimerModal'));

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            timerModal: false,
        };
    }

    componentDidMount() {
        this.setupTimer();
    };

    componentDidUpdate(prevProps) {
        if (prevProps.timerRun !== this.props.timerRun) {
            this.setupTimer();
        }
    };

    setupTimer = () => {
        if (this.props.timerRun) {
            this.timer = setInterval(() => {
                this.props.timerStart(this.props.interval - 1)
            }, 1000);
        } else {
            clearInterval(this.timer);
            if (this.props.interval === 0) {
                this.props.globalPlayPause(false);
            }
        }
    };

    toggleModal = () => this.setState({ modal: !this.state.modal });
    toggleTimerModal = () => this.setState({ timerModal: !this.state.timerModal });

    render() {
        const activeSounds = this.props.activeSounds;
        const hasActiveSounds = activeSounds.length > 0;
        //TODO: extract mixtures stuff to a separate component
        const mixtures = (this.props.mixtures || []).map(x => <Mixture title={x.id} id={x.id} key={x.id} isActive={x.isActive}
            delete={this.props.deleteMixture}
            deactivate={this.props.deactivateMixtures}
            switch={this.props.switchMixture} />)

        return (
            <>
                {hasActiveSounds && this.props.isGlobalPlay && <div className='timer-div'>
                    <TimerControl onClick={this.toggleTimerModal} interval={this.props.interval} timerRun={this.props.timerRun} />
                </div>}
                <div className='mixtures-div d-none d-md-block container-fluid'>
                    {hasActiveSounds && <div className='row'>
                        <div className='col-9 col-sm-9 col-md-9 col-lg-9'>
                            <span>Playing now</span>
                        </div>
                        <div className='col-3 col-sm-3 col-md-3 col-lg-3'></div>
                    </div>}
                    {hasActiveSounds && <MixtureFuture activeSounds={activeSounds} pauseSound={this.props.pauseSound} saveClick={this.toggleModal} />}
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
                <RowsView sounds={this.props.readySounds} playPauseVolume={this.props.playPauseVolume} isGlobalPlay={this.props.isGlobalPlay || false} />
                <SaveMixtureModal isOpen={this.state.modal} toggle={this.toggleModal} save={this.props.addMixture} />
                <TimerModal isOpen={this.state.timerModal}
                    toggle={this.toggleTimerModal}
                    start={this.props.timerStart}
                    stop={this.props.timerStop}
                    timerRun={this.props.timerRun}
                    interval={this.props.interval} />

                {hasActiveSounds && this.props.isMobile &&
                    <Affix className='fixed-bottom' offsetbottom={45}>
                        <PlayingNow activeSounds={activeSounds} pauseSound={this.props.pauseSound} saveClick={this.toggleModal} />
                    </Affix>
                }
            </>
        );
    };
};

export default connect(
    state => ({ ...state.main, ...state.timer }),
    dispatch => bindActionCreators({ ...mainActions, ...timerActions }, dispatch)
)(Home);