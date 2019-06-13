import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Share from '../components/Share';
import constants from '../constants/defaultValues';
import logo from '../logo.png';
import PropTypes from 'prop-types'

const HeaderWeb = (props) => {
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
                    <NavLink to='/donate' className='top-bar-item px-lg-5 px-4' title='Buy us a cup of coffee :)'>Donate</NavLink>
                </div>
            </div>
        </header>
    );
}

const HeaderMobile = (props) => {
    return (
        <header className='d-flex justify-content-around align-items-center'>
            <Share reduxSounds={props.reduxSounds} className='top-bar-item' />
            <Link to='/' title={constants.appName}>
                <img src={logo} alt={constants.appName} style={{ height: '45px' }} />
            </Link>
            <NavLink to='/donate' className='top-bar-item' title='Buy us a cup of coffee :)'>Donate</NavLink>
        </header>
    );
}

const Header = (props) => props.isMobile ? <HeaderMobile {...props} /> : <HeaderWeb {...props} />;

Header.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    reduxSounds: PropTypes.object.isRequired
}

export default Header;