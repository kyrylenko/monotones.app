import React, { Component } from 'react';
import { Route } from 'react-router';
import App from './App';
import { RowsView } from './components/RowsView';
import About from './screens/About'

export default class Router extends Component {
  displayName = Router.name

  render() {
    return (
      <App>
        <Route exact path='/' component={RowsView} />
        <Route path='/about' component={About} />
      </App>
    );
  }
}