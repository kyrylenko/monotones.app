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
                    <div className='app-header'>
                        <Link to='/' title={constants.appName}>
                            <img src={logo} className='app-logo' alt={constants.appName} />
                        </Link>
                        <h1 className='app-title'>{constants.appName}</h1>
                    </div>
                </div>
                <div className='col-4 d-flex justify-content-around app-title align-items-center'>
                    <Share reduxSounds={props.reduxSounds} className='top-bar-item' />
                    <Link to='/donate' className='top-bar-item' title='Buy us a cup of coffee :)'>Donate</Link>
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