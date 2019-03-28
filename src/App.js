import React, { Component, Suspense, lazy } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Layout from './Layout';
import Home from './screens/Home';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as mainActions } from './store/mainReducer';
import { actionCreators as timerActions } from './store/timerReducer';
import Player from './components/Player';
import GlobalPlayPause from './components/GlobalPlayPause';
import { aggregateSounds } from './utils/Utils';

const About = lazy(() => import('./screens/About'));
const Terms = lazy(() => import('./screens/Terms'));
const Donate = lazy(() => import('./screens/Donate'));

const mediaQuery = window.matchMedia('(max-width: 768px)')

class App extends Component {

  state = {
    isMobile: false
  };

  componentDidMount() {
    document.addEventListener('keydown', this.spaceHandler, false);
    mediaQuery.addListener(this.mediaQueryHandler);
    this.mediaQueryHandler(mediaQuery);
  };

  componentWillUnmount() {
    document.removeEventListener('keydown', this.spaceHandler, false);
    mediaQuery.removeListener(this.mediaQueryHandler);
  };

  //Play / Pause on click space  
  spaceHandler = (event) => {
    if (event.keyCode === 32 && event.target.tagName !== 'INPUT') {
      this.props.globalPlayPause(!this.props.isGlobalPlay);
      event.preventDefault();
    }
  };

  mediaQueryHandler = (x) => this.setState({ isMobile: x.matches });

  render() {
    const players = aggregateSounds(this.props.sounds)
      .map(x => <Player
        setSoundLoaded={this.props.setSoundLoaded}
        isGlobalPlay={this.props.isGlobalPlay || false}
        key={x.id}
        id={x.id}
        isPlay={x.isPlay}
        volume={x.volume} />);

    const activeSounds = Object.values(this.props.sounds).filter(s => s.isPlay);

    return (
      <Layout reduxSounds={this.props.sounds} isMobile={this.state.isMobile}>
        {this.props.isCaching && <div>Getting things ready...</div>}
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path='/' render={props => <Home {...props} isMobile={this.state.isMobile} />} />
            <Route exact path='/about' render={props => <About {...props} />} />
            <Route exact path='/terms' render={props => <Terms {...props} />} />
            <Route exact path='/donate' render={props => <Donate {...props} />} />
            <Route exact path='/share/:sounds?' render={props => {
              if (props.match.params.sounds !== undefined) {
                const sounds = props.match.params.sounds.match(/.{1,2}(?=(.{2})+(?!.))|.{1,2}$/g);
                this.props.setSounds(sounds);
              }
              return <Redirect to='/' />;
            }} />
          </Switch>
        </Suspense>
        {players}
        {activeSounds.length > 0 && <GlobalPlayPause isGlobPlay={this.props.isGlobalPlay || false}
          playPause={(shouldPlay) => {
            this.props.globalPlayPause(shouldPlay)
            if (!shouldPlay) {
              this.props.timerStop()
            }
          }} />}
      </Layout>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  const { setSounds, setSoundLoaded, globalPlayPause } = mainActions;
  const { timerStop } = timerActions;

  return bindActionCreators({ setSounds, setSoundLoaded, globalPlayPause, timerStop }, dispatch);
};

export default withRouter(connect(
  state => ({ ...state.main, ...state.loading }),
  mapDispatchToProps
)(App));