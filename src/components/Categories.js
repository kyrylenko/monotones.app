import React from 'react';
import { Link } from 'react-router-dom';

function getPath(actual, path) {
    return actual === path ? '/' : path;
};

function getClass(actual, path) {
    return actual === path ? 'active' : '';
};

export const CategoriesWeb = ({ pathname }) => {
    return (
        <div className='mx-auto' style={{ width: '80px' }}>
            <div className='nav flex-column nav-pills web'>
                <li className='nav-item'>
                    <Link to={getPath(pathname, '/sleep')} title='Sleep' className={`nav-link ${getClass(pathname, '/sleep')}`}>Sleep</Link>
                </li>
                <li className='nav-item my-2'>
                    <Link to={getPath(pathname, '/relax')} title='Relax' className={`nav-link ${getClass(pathname, '/relax')}`}>Relax</Link>
                </li>
                <li className='nav-item'>
                    <Link to={getPath(pathname, '/focus')} title='Focus' className={`nav-link ${getClass(pathname, '/focus')}`}>Focus</Link>
                </li>
            </div>
        </div>
    );
}

export const CategoriesMobile = ({ pathname }) => {
    return (
        <div className='nav nav-pills' style={{ position: 'sticky', height: '44px' }}>
            <li className='nav-item flex-fill'>
                <Link to={getPath(pathname, '/sleep')} title='Sleep' className={`nav-link ${getClass(pathname, '/sleep')}`}>Sleep</Link>
            </li>
            <li className='nav-item flex-fill'>
                <Link to={getPath(pathname, '/relax')} title='Relax' className={`nav-link ${getClass(pathname, '/relax')}`}>Relax</Link>
            </li>
            <li className='nav-item flex-fill'>
                <Link to={getPath(pathname, '/focus')} title='Focus' className={`nav-link ${getClass(pathname, '/focus')}`}>Focus</Link>
            </li>
        </div>
    );
}