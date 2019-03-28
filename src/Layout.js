import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import './App.css';

class Layout extends Component {

  render() {
    return (
      <div className='app'>
        <Header reduxSounds={this.props.reduxSounds} isMobile={this.props.isMobile} />
        {this.props.children}
        <footer className='container footer-logo-welcome'>
          <div className='row'>
            <nav className='col-lg-12 col-md-12 col-sm-12 col-xs-12 footer-logo-menu'>
              <ul style={{ marginBottom: 0 }}>
                {/* <li><a target='_blank' rel='noopener noreferrer' href='/about'>About/Features</a></li> */}
                <li><Link to='/about' >About</Link> </li>
                <li><Link to='/terms' >Terms &amp; Privacy</Link> </li>
                <li><a target='_blank' rel='noopener noreferrer' href='mailto:contact@monotones.app'>Contact</a></li>
              </ul>
            </nav>
          </div>
        </footer>
      </div>
    );
  }
}


export default Layout;