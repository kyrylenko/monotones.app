import React, { Component, Suspense, lazy } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Layout from './Layout';
import Home from './screens/Home';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as mainActions } from './store/mainReducer';
import Player from './components/Player';
import { aggregateSounds } from './utils/Utils';

const About = lazy(() => import('./screens/About'));
const Terms = lazy(() => import('./screens/Terms'));

class App extends Component {

  render() {
    const players = aggregateSounds(this.props.sounds)
      .map(x => <Player
        setSoundLoaded={this.props.setSoundLoaded}
        isGlobalPlay={this.props.isGlobalPlay || false}
        key={x.id}
        id={x.id}
        isPlay={x.isPlay}
        volume={x.volume} />);

    return (
      <Layout>
        {this.props.isCaching && <div className='white-text'>Getting things ready...</div>}
        <Suspense fallback={<div className='white-text'>Loading...</div>}>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/about' render={props => <About {...props} />} />
            <Route exact path='/terms' render={props => <Terms {...props} />} />
            <Route exact path='/share/:sounds' render={props => {
              const sounds = props.match.params.sounds.match(/.{1,2}(?=(.{2})+(?!.))|.{1,2}$/g);
              this.props.setSounds(sounds);
              return <Redirect to='/' />;
            }} />
          </Switch>
        </Suspense>
        {players}
      </Layout>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  const { setSounds, setSoundLoaded } = mainActions;
  return bindActionCreators({ setSounds, setSoundLoaded }, dispatch);
};

export default withRouter(connect(
  state => ({ ...state.main, ...state.loading }),
  mapDispatchToProps
)(App));