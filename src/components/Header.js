import React from 'react';
import { Link } from 'react-router-dom';
import Share from '../components/Share';
import constants from '../constants/defaultValues';
import logo from '../logo.png';

//import PropTypes from 'prop-types'

const Header = (props) => {

    return (
        <header className='container-fluid'>
            <div className='row justify-content-end'>
                <div className='col-4'>
                    <Link to='/' title={constants.appName}>
                        <img src={logo} className='app-logo' alt={constants.appName} />
                    </Link>
                    <h3>{constants.appName}</h3>
                </div>
                <div className='col-4 d-flex justify-content-end align-items-center app-title'>
                    <Share reduxSounds={props.reduxSounds} className='top-bar-item px-lg-5 px-4' />
                    <Link to='/donate' className='top-bar-item px-lg-5 px-4' title='Buy us a cup of coffee :)'>Donate</Link>
                </div>
            </div>
        </header>
    );
}

/* TopBar.propTypes = {
    playPauseVolume: PropTypes.func.isRequired,
    isGlobalPlay: PropTypes.bool.isRequired,
    sounds: PropTypes.array.isRequired
} */

export default Header;