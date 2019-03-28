import React from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import './App.css';

const Layout = (props) => {

  return (
    <div className='app'>
      <Header reduxSounds={props.reduxSounds} isMobile={props.isMobile} />
      {props.children}
      <footer className='container footer-logo-welcome'>
        <div className='row'>
          <nav className='col-lg-12 col-md-12 col-sm-12 col-xs-12 footer-logo-menu'>
            <ul style={{ marginBottom: 0 }}>
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


export default Layout;