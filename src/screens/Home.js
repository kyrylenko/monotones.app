import React, { Component } from 'react';
import { RowsView } from '../components/RowsView';
import { CSSTransitionGroup } from 'react-transition-group';
import { GlobalPlayPause } from '../components/GlobalPlayPause';
import MixtureFuture from '../components/MixtureFuture';
import Mixture from '../components/Mixture';
import { SaveMixtureModal } from '../components/Modals';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/sounds';
import soundIds from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';

import { Container, Row, Col } from 'reactstrap';

class Home extends Component {

    //sounds = Object.values(soundIds).map(x => { return { id: x, isPlay: false, volume: 0.1 } });
    constructor(props) {
        super(props);

        this.state = {
            modal: false
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

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

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

    render() {
        console.log('render home')
        let activeSounds = this.props.sounds.filter(s => s.isPlay);
        let mixtures = (this.props.mixtures || []).map(x => <Mixture title={x.id} id={x.id} key={x.id} isActive={x.isActive}
            delete={this.props.deleteMixture}
            deactivate={this.props.deactivateMixtures}
            switch={this.props.switchMixture} />)

        return (
            <div>
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
            </div>
        );
    };
};

export default connect(
    state => state.main,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);