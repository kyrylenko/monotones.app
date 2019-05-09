import React from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import background from './assets/icons/background.png';
import './App.css';
import './Breathing.css';

const Layout = (props) => {

  return (
    <>
      <Header reduxSounds={props.reduxSounds} isMobile={props.isMobile} />
      <main>
        {props.children}
      </main>
      <footer className='footer mt-auto'>
        <div className='container-fluid'>
          <div className='row py-3 py-md-5'>
            <nav className='col-lg-12 col-md-12 col-sm-12 col-xs-12 footer-menu'>
              <ul style={{ marginBottom: 0 }} className='px-0'>
                <li><Link to='/about' >About</Link> </li>
                <li><Link to='/terms' >Terms</Link> </li>
                <li><a target='_blank' rel='noopener noreferrer' href='mailto:contact@monotones.app'>Contact</a></li>
              </ul>
            </nav>
          </div>
          <div className='row'>
            <div className='col-12 background'>
              <img src={background} alt=''></img>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}


export default Layout;