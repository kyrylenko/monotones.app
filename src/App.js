import React, { Component } from 'react';
import { Route } from 'react-router';
import Layout from './Layout';
import Home from './screens/Home';
import About from './screens/About'
import Terms from './screens/Terms'

export default class App extends Component {
  displayName = App.name

  render() {    
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
        <Route path='/terms' component={Terms} />
      </Layout>
    );
  }
}