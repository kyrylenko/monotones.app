import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import LanguagePicker from './components/LanguagePicker';
import './App.css';
import './Breathing.css';

const Layout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className='site-main'>
        {children}
      </main>
      <footer className='site-footer'>
        <nav className='footer-menu'>
          <NavLink to='/about'>{t('about')}</NavLink>
          <NavLink to='/terms'>{t('terms')}</NavLink>
          <a target='_blank' rel='noopener noreferrer' href='mailto:contact@monotones.app'>{t('contact')}</a>
          <LanguagePicker />
        </nav>
      </footer>
    </>
  );
};

export default Layout;
