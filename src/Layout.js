import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from './components/Header';
import LanguagePicker from './components/LanguagePicker';
import background from './assets/icons/background.png';
import { useTranslation } from 'react-i18next';
import './App.css';
import './Breathing.css';

const Layout = (props) => {
  const { t } = useTranslation();

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
                <li><NavLink to='/about' >{t('about')}</NavLink> </li>
                <li><NavLink to='/terms' >{t('terms')}</NavLink> </li>
                <li><a target='_blank' rel='noopener noreferrer' href='mailto:contact@monotones.app'>{t('contact')}</a></li>
                <li><LanguagePicker /></li>
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