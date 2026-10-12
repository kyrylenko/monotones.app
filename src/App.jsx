import React, { Component, Suspense, lazy, useEffect } from 'react';
import { Route, Navigate, Routes, useLocation, useParams } from 'react-router-dom';
import Layout from './Layout';
import Home from './screens/Home';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as mainActions } from './store/mainReducer';
import { actionCreators as timerActions } from './store/timerReducer';
import Player from './components/Player';
import GlobalPlayPause from './components/GlobalPlayPause';
import { aggregateSounds } from './utils/Utils';

const About = lazy(() => import(/* webpackChunkName: "about" */ './screens/About'));
const Terms = lazy(() => import(/* webpackChunkName: "terms" */ './screens/Terms'));

const mediaQuery = window.matchMedia('(max-width: 768px)')

//Applies the sounds from a shared link (e.g. /share/kbce) and goes home
const ShareRoute = ({ setSounds }) => {
  const { sounds } = useParams();

  useEffect(() => {
    if (sounds !== undefined) {
      setSounds(sounds.match(/.{1,2}(?=(.{2})+(?!.))|.{1,2}$/g) || []);
    }
  }, [sounds, setSounds]);

  return <Navigate to='/' replace />;
};

class App extends Component {

  state = { isMobile: false };

  componentDidMount() {
    document.addEventListener('keydown', this.spaceHandler, false);
    mediaQuery.addEventListener('change', this.mediaQueryHandler);
    this.mediaQueryHandler(mediaQuery);
  };

  componentWillUnmount() {
    document.removeEventListener('keydown', this.spaceHandler, false);
    mediaQuery.removeEventListener('change', this.mediaQueryHandler);
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
    const { relaxSounds, sleepSounds, focusSounds } = aggregateSounds(this.props.sounds);
    const allSounds = [...relaxSounds, ...sleepSounds, ...focusSounds];

    let readySounds = [];
    switch (this.props.location.pathname) {
      case '/relax':
        readySounds = relaxSounds;
        break;
      case '/sleep':
        readySounds = sleepSounds;
        break;
      case '/focus':
        readySounds = focusSounds;
        break;
      default:
        readySounds = allSounds;
        break;
    }
    
    const activeSounds = Object.values(this.props.sounds).filter(s => s.isPlay);

    const players = allSounds.map(x => <Player
      setSoundLoaded={this.props.setSoundLoaded}
      isGlobalPlay={this.props.isGlobalPlay || false}
      key={x.id}
      id={x.id}
      isPlay={x.isPlay}
      volume={x.volume} />);

    const home = <Home
      location={this.props.location}
      isMobile={this.state.isMobile}
      readySounds={readySounds}
      activeSounds={activeSounds} />;

    return (
      <Layout reduxSounds={this.props.sounds} isMobile={this.state.isMobile}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={home} />
            <Route path='/relax' element={home} />
            <Route path='/sleep' element={home} />
            <Route path='/focus' element={home} />
            <Route path='/about' element={<About />} />
            <Route path='/terms' element={<Terms />} />
            <Route path='/share/:sounds?' element={<ShareRoute setSounds={this.props.setSounds} />} />
          </Routes>
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

const ConnectedApp = connect(
  //state => ({ ...state.main, ...state.loading }),
  state => state.main,
  mapDispatchToProps
)(App);

const AppWithLocation = () => <ConnectedApp location={useLocation()} />;

export default AppWithLocation;