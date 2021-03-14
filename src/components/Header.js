import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Share from '../components/Share';
import constants from '../constants/defaultValues';
import logo from '../logo.png';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';

const HeaderWeb = (props) => {
    const { t } = useTranslation();
    return (
        <header className='container-fluid'>
            <div className='row justify-content-end'>
                <div className='col-4'>
                    <Link to='/' title={constants.appName}>
                        <img src={logo} className='app-logo' alt={constants.appName} />
                    </Link>
                </div>
                <div className='col-4 d-flex justify-content-end align-items-center app-title'>
                    <Share reduxSounds={props.reduxSounds} className='top-bar-item px-lg-5 px-4' />                    
                    <a href='https://www.patreon.com/monotones' target='_blank' rel='noreferrer' rel='noopener' className='top-bar-item px-lg-5 px-4' title={t('buy_us_coffee')}>{t('donate')}</a>
                </div>
            </div>
        </header>
    );
}

const HeaderMobile = (props) => {
    const { t } = useTranslation();
    return (
        <header className='d-flex justify-content-around align-items-center'>
            <Share reduxSounds={props.reduxSounds} className='top-bar-item' />
            <Link to='/' title={constants.appName}>
                <img src={logo} alt={constants.appName} style={{ height: '45px' }} />
            </Link>            
            <a href='https://www.patreon.com/monotones' target='_blank' rel='noreferrer' rel='noopener'className='top-bar-item' title={t('buy_us_coffee')}>{t('donate')}</a>
        </header>
    );
}

const Header = (props) => props.isMobile ? <HeaderMobile {...props} /> : <HeaderWeb {...props} />;

Header.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    reduxSounds: PropTypes.object.isRequired
}

export default Header;