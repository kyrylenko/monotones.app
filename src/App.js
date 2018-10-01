import React, { Component } from 'react';
import { Route } from 'react-router';
import Layout from './Layout';
import Home from './screens/Home';
import About from './screens/About'

export default class App extends Component {
  displayName = App.name

  render() {    
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
      </Layout>
    );
  }
}