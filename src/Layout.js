import React, { Component } from 'react';
/* import { Link } from 'react-router-dom'; */

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
          {/* <Link to='about' target="_blank" className='btn btn-primary'>About</Link> */}
        </header>
        {this.props.children}

        <div className="footer-logo-welcome" data-element="footer-logo-welcome" id="desktop-footer">
          <div className="container">
            <div className="row" id="footer-logo-welcome-div">
              <div className="hidden-lg hidden-md hidden-sm col-xs-1 text-center"></div>
              <div className="col-lg-2 col-md-2 col-sm-12 col-xs-10" id="footer-logo-welcome-noisli">
                <a href="https://www.noisli.com">{constants.appName}</a>
              </div>
              <div className="hidden-lg hidden-md hidden-sm col-xs-1 text-center"></div>
              <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12" id="footer-logo-welcome-menu">
                <ul style={{marginBottom: 0}}>
                  <li><a target="_blank" rel="noopener noreferrer" href="/about">About</a></li>
                  <li><a target="_blank" rel="noopener noreferrer" href="/apps">Apps</a></li>                  
                  <li><a target="_blank" rel="noopener noreferrer" href="http://blog.noisli.com">Blog</a></li>
                  <li><a target="_blank" rel="noopener noreferrer" href="/features">Features</a></li>
                  <li><a target="_blank" rel="noopener noreferrer" href="/terms">Terms &amp; Privacy</a></li>
                  <li>
                    <script type="text/javascript"></script>
                    <a target="_blank" rel="noopener noreferrer" href="mailto:contact@monotones.app">Contact</a>
                  </li>
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