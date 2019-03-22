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
import soundIds from '../constants/soundIds';
import share from '../assets/icons/share.svg';
import SharePopover from '../components/SharePopover';
import { Container, Row, Col } from 'reactstrap';
import TimerControl from '../components/TimerControl';
import { aggregateSounds } from '../utils/Utils';
const SaveMixtureModal = React.lazy(() => import('../components/Modals'));
const TimerModal = React.lazy(() => import('../components/TimerModal'));
//Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const isMobile =document.documentElement.clientWidth <= 768;

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            timerModal: false,
            popover: false,
            shareUrl: window.location.origin,
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

    togglePopover = () => this.setState({ popover: !this.state.popover });

    share = () => {
        const activeIds = Object.values(this.props.sounds).filter(x => x.isPlay).map(x => x.id);
        const activeAbbrs = Object.entries(soundIds)
            .filter(x => activeIds.some(s => s === x[1])).map(x => x[0]);

        const parameter = activeAbbrs.reduce((acc, item) => acc += item);

        this.setState({
            shareUrl: `https://monotones.app/share/${parameter}`,
            popover: true
        });
    };

    render() {
        //console.log('Home props ', this.props);
        const activeSounds = Object.values(this.props.sounds).filter(s => s.isPlay);
        const mixtures = (this.props.mixtures || []).map(x => <Mixture title={x.id} id={x.id} key={x.id} isActive={x.isActive}
            delete={this.props.deleteMixture}
            deactivate={this.props.deactivateMixtures}
            switch={this.props.switchMixture} />)

        return (
            <>
                {activeSounds.length > 0 && this.props.isGlobalPlay && <div className='timer-div'>
                    <TimerControl onClick={this.toggleTimerModal} interval={this.props.interval} timerRun={this.props.timerRun} />
                </div>}
                {activeSounds.length > 0 && <div className='share-div'>
                    <img src={share} alt='Share' title='Share sounds' id='popover' onClick={this.share}></img>
                </div>}
                <Container fluid className='mixtures-div d-none d-md-block'>
                    {activeSounds.length > 0 && <Row>
                        <Col lg={9} md={9} sm={9} xs={9}>
                            <span className='white-text'>Playing now</span>
                        </Col>
                        <Col lg={3} md={3} sm={3} xs={3}></Col>
                    </Row>}
                    {activeSounds.length > 0 && <MixtureFuture activeSounds={activeSounds} pauseSound={this.props.pauseSound} saveClick={this.toggleModal} />}
                    {mixtures.length > 0 && <Row style={{ marginTop: '25px' }}>
                        <Col lg={9} md={9} sm={9} xs={9}>
                            <span className='white-text'>My Mixtures</span>
                        </Col>
                        <Col lg={3} md={3} sm={3} xs={3}></Col>
                    </Row>}
                    <CSSTransitionGroup
                        transitionName='mixanim'
                        transitionEnterTimeout={400}
                        transitionLeaveTimeout={400}>
                        {mixtures}
                    </CSSTransitionGroup>
                </Container>
                <RowsView sounds={aggregateSounds(this.props.sounds)} playPauseVolume={this.props.playPauseVolume} isGlobalPlay={this.props.isGlobalPlay || false} />
                <SaveMixtureModal isOpen={this.state.modal} toggle={this.toggleModal} save={this.props.addMixture} />
                <TimerModal isOpen={this.state.timerModal}
                    toggle={this.toggleTimerModal}
                    start={this.props.timerStart}
                    stop={this.props.timerStop}
                    timerRun={this.props.timerRun}
                    interval={this.props.interval} />
                {activeSounds.length > 0 &&
                    <SharePopover isOpen={this.state.popover} toggle={this.togglePopover} url={this.state.shareUrl} />
                }
                {activeSounds.length > 0 && isMobile && <footer className='fixed-bottom'>
                    <PlayingNow activeSounds={activeSounds} pauseSound={this.props.pauseSound} saveClick={this.toggleModal} />
                </footer>}
            </>
        );
    };
};

export default connect(
    state => ({ ...state.main, ...state.timer }),
    dispatch => bindActionCreators({ ...mainActions, ...timerActions }, dispatch)
)(Home);