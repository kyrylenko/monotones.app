import React, { Component } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Layout from './Layout';
import Home from './screens/Home';
import About from './screens/About'
import Terms from './screens/Terms'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from './store/sounds';

class App extends Component {

  render() {
    console.log(this.props)
    return (
      <Layout>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/terms' component={Terms} />
          <Route exact path='/share/:sounds' render={(props) => {
            const sounds = props.match.params.sounds.match(/.{1,2}(?=(.{2})+(?!.))|.{1,2}$/g);
            //console.log(sounds)
            this.props.setSounds(sounds);
            //TODO: maybe redirect within action creator?
            return <Redirect to='/' />;
          }} />
        </Switch>
      </Layout>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  const { setSounds } = actionCreators;
  return bindActionCreators({ setSounds }, dispatch);
};

export default withRouter(connect(
  null,
  mapDispatchToProps
)(App));