import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Share from '../components/Share';
import constants from '../constants/defaultValues';
import logo from '../logo.png';

//import PropTypes from 'prop-types'

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

/* TopBar.propTypes = {
    playPauseVolume: PropTypes.func.isRequired,
    isGlobalPlay: PropTypes.bool.isRequired,
    sounds: PropTypes.array.isRequired
} */

export default HeaderMobile;