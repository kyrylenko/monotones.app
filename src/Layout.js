import React from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import './Breathing.css';

const Layout = (props) => {

  return (
    <>
      <Header reduxSounds={props.reduxSounds} isMobile={props.isMobile} />
      <main>
        {props.children}
      </main>
      <footer className='footer mt-auto py-2 py-md-3'>
        <div className='container'>
          <div className='row'>
            <nav className='col-lg-12 col-md-12 col-sm-12 col-xs-12 footer-logo-menu'>
              <ul style={{ marginBottom: 0 }}>
                <li><Link to='/about' >About</Link> </li>
                <li><Link to='/terms' >Terms &amp; Privacy</Link> </li>
                <li><a target='_blank' rel='noopener noreferrer' href='mailto:contact@monotones.app'>Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}


export default Layout;