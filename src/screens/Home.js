import React, { Component } from 'react';
import { RowsView } from '../components/RowsView';
import { CSSTransitionGroup } from 'react-transition-group';
import { GlobalPlayPause } from '../components/GlobalPlayPause';
import MixtureFuture from '../components/MixtureFuture';
import Mixture from '../components/Mixture';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/sounds';
import soundIds from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';
import share from '../assets/icons/share.svg';
import timer from '../assets/icons/timer.svg';
import {
    FacebookShareButton,
    GooglePlusShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
    GooglePlusIcon
} from 'react-share';
import { Container, Row, Col, Popover, PopoverHeader, PopoverBody, Tooltip } from 'reactstrap';
const SaveMixtureModal = React.lazy(() => import('../components/Modals'));
const TimerModal = React.lazy(() => import('../components/TimerModal'));

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            timerModal: false,
            popover: false,
            tooltip: false,
            share: window.location.origin,
            copied: false
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.spaceFunction, false);
    };
    componentWillUnmount() {
        document.removeEventListener('keydown', this.spaceFunction, false);
    };
    //Play / Pause on click space  
    spaceFunction = (event) => {
        if (event.keyCode === 32 && event.target.tagName !== 'INPUT') {
            this.props.globalPlayPause(!this.props.isGlobalPlay);
            event.preventDefault();
        }
    };

    toggleModal = () => this.setState({ modal: !this.state.modal });
    toggleTimerModal = () => this.setState({ timerModal: !this.state.timerModal });

    togglePopover = () => this.setState({ popover: !this.state.popover });
    toggleTooltip = () => this.setState({ tooltip: !this.state.tooltip });

    aggregateSounds = () => {
        let aggregate = Object.values(soundIds).map(x => {
            let setting = this.props.sounds.find(s => s.id === x);
            let hasSetting = setting !== undefined;

            return {
                id: x,
                isPlay: hasSetting ? setting.isPlay : false,
                volume: hasSetting ? setting.volume : defaultValues.defaultVolume
            };
        });

        return aggregate;
    };

    selectAndCopy = (e) => {
        e.target.select();
        document.execCommand('copy');
        this.setState({ copied: true });
    };

    share = () => {
        const sounds = this.props.sounds.filter(x => x.isPlay).map(x => x.id);
        const activeIds = Object.entries(soundIds)
            .filter(x => sounds.some(s => s === x[1])).map(x => x[0]);

        const parameter = activeIds.reduce((acc, item) => acc += item);

        this.setState({
            share: `https://monotones.app/share/${parameter}`,//${window.location.href}
            popover: true
        });
    };

    timer = (interval) => {
        console.log('set timer ', interval);
    };

    render() {
        const activeSounds = this.props.sounds.filter(s => s.isPlay);
        const mixtures = (this.props.mixtures || []).map(x => <Mixture title={x.id} id={x.id} key={x.id} isActive={x.isActive}
            delete={this.props.deleteMixture}
            deactivate={this.props.deactivateMixtures}
            switch={this.props.switchMixture} />)

        return (
            <>
                {activeSounds.length > 0 && <div className='timer-div'>
                    <img src={timer} alt='Timer' title='Set pause interval' id='timer' onClick={this.toggleTimerModal}></img>
                </div>}
                {activeSounds.length > 0 && <div className='share-div'>
                    <img src={share} alt='Share' title='Share sounds' id='popover' onClick={this.share}></img>
                </div>}
                {activeSounds.length > 0 && <GlobalPlayPause isGlobPlay={this.props.isGlobalPlay || false} playPause={(m) => this.props.globalPlayPause(m)} />}
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
                <RowsView sounds={this.aggregateSounds()} playPauseVolume={this.props.playPauseVolume} isGlobalPlay={this.props.isGlobalPlay || false} />
                <SaveMixtureModal isOpen={this.state.modal} toggle={this.toggleModal} save={this.props.addMixture} />
                <TimerModal isOpen={this.state.timerModal} toggle={this.toggleTimerModal} timer={this.timer} />
                {activeSounds.length > 0 &&
                    <Popover placement={'left'} isOpen={this.state.popover} target={'popover'} toggle={this.togglePopover}>
                        <PopoverHeader>Share sounds</PopoverHeader>
                        <PopoverBody>
                            <input type='url' className='form-control' onFocus={this.selectAndCopy} onBlur={() => this.setState({ copied: false })} id='tooltip' defaultValue={this.state.share}></input>
                            <div className='d-flex justify-content-center my-2'>
                                <FacebookShareButton
                                    url={this.state.share}
                                    className='share-button mx-1'>
                                    <FacebookIcon
                                        size={32}
                                        round />
                                </FacebookShareButton>
                                <GooglePlusShareButton
                                    url={this.state.share}
                                    className='share-button mx-1'>
                                    <GooglePlusIcon
                                        size={32}
                                        round />
                                </GooglePlusShareButton>
                                <TwitterShareButton
                                    url={this.state.share}
                                    className='share-button mx-1'>
                                    <TwitterIcon
                                        size={32}
                                        round />
                                </TwitterShareButton>
                            </div>
                        </PopoverBody>
                        <Tooltip placement='top' isOpen={this.state.tooltip} target='tooltip' toggle={this.toggleTooltip}>
                            {this.state.copied ? 'Copied!' : 'Click to copy'}
                        </Tooltip>
                    </Popover>
                }
            </>
        );
    };
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);