import React, { Component } from 'react';
import RowsView from '../components/RowsView';
import PlayingNow from '../components/PlayingNow';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as mainActions } from '../store/mainReducer';
import { actionCreators as timerActions } from '../store/timerReducer';
import TimerControl from '../components/TimerControl';
import { CategoriesMobile, CategoriesWeb } from '../components/Categories';
import MixtureContainer from '../components/MixtureContainer';
import FixedControlsContainer from '../components/FixedControlsContainer';
const SaveMixtureModal = React.lazy(() => import('../components/Modals'));
const TimerModal = React.lazy(() => import('../components/TimerModal'));

class Home extends Component {
    state = {
        modal: false,
        timerModal: false,
    };

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
        const hasActiveSounds = this.props.activeSounds.length > 0;

        return (
            <>
                {hasActiveSounds && this.props.isGlobalPlay && <div className='timer-div'>
                    <TimerControl onClick={this.toggleTimerModal} interval={this.props.interval} timerRun={this.props.timerRun} />
                </div>}
                {this.props.isMobile && <CategoriesMobile />}
                {!this.props.isMobile && <FixedControlsContainer
                    left={<CategoriesWeb pathname={this.props.location.pathname} />}
                    right={<MixtureContainer activeSounds={this.props.activeSounds} toggleModal={this.toggleModal} />}
                />}
                <RowsView sounds={this.props.readySounds} playPauseVolume={this.props.playPauseVolume} isGlobalPlay={this.props.isGlobalPlay || false} />
                <SaveMixtureModal isOpen={this.state.modal} toggle={this.toggleModal} save={this.props.addMixture} />
                <TimerModal isOpen={this.state.timerModal}
                    toggle={this.toggleTimerModal}
                    start={this.props.timerStart}
                    stop={this.props.timerStop}
                    timerRun={this.props.timerRun}
                    interval={this.props.interval} />
                {hasActiveSounds && this.props.isMobile && <div className='fixed-bottom'>
                    <PlayingNow activeSounds={this.props.activeSounds} pauseSound={this.props.pauseSound} saveClick={this.toggleModal} />
                </div>}
            </>
        );
    };
};

export default connect(
    state => ({ ...state.main, ...state.timer }),
    dispatch => bindActionCreators({
        ...mainActions,//TODO: do not connect redundant action creators
        ...timerActions,
    }, dispatch)
)(Home);