import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import constants from './constants/defaultValues';
import logo from './logo.svg';
import './App.css';

class Layout extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{constants.appName}</h1>          
        </header>
        {this.props.children}

        <div className="footer-logo-welcome">
          <div className="container">
            <div className="row">
              <div className="hidden-lg hidden-md hidden-sm col-xs-1 text-center"></div>
              <div className="col-lg-2 col-md-2 col-sm-12 col-xs-10 footer-logo">
                <a href="https://monotones.app/">{constants.appName}</a>
              </div>
              <div className="hidden-lg hidden-md hidden-sm col-xs-1 text-center"></div>
              <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 footer-logo-menu">
                <ul style={{ marginBottom: 0 }}>
                  {/* <li><a target="_blank" rel="noopener noreferrer" href="/about">About/Features</a></li> */}
                  <li><Link to='about' target="_blank">About</Link> </li>
                  <li><Link to='terms' target="_blank">Terms &amp; Privacy</Link> </li>
                  <li><a target="_blank" rel="noopener noreferrer" href="mailto:contact@monotones.app">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default Layout;