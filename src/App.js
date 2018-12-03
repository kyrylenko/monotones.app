import React, { Component } from 'react';
import { Route } from 'react-router';
import Layout from './Layout';
import Home from './screens/Home';
import About from './screens/About'
import Terms from './screens/Terms'

export default class App extends Component {

  render() {    
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/about' component={About} />
        <Route exact path='/terms' component={Terms} />
      </Layout>
    );
  }
}