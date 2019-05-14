import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export const CategoriesWeb = ({ pathname }) => {
    function getPath(path) {
        return pathname === path ? '/' : path;
    };

    function getClass(path) {
        return pathname === path ? 'active' : '';
    };

    return (
        <div className='mx-auto' style={{ width: '80px' }}>
            <div className='pb-2 caption'>Filters</div>
            <div className='list-group'>
                <Link to={getPath('/sleep')} title='Sleep' className={`list-group-item list-group-item-action ${getClass('/sleep')}`}>Sleep</Link>
                <Link to={getPath('/relax')} title='Relax' className={`list-group-item list-group-item-action ${getClass('/relax')}`}>Relax</Link>
                <Link to={getPath('/focus')} title='Focus' className={`list-group-item list-group-item-action ${getClass('/focus')}`}>Focus</Link>
            </div>
        </div>

    );
}

export const CategoriesMobile = (props) => {
    return (
        <div className='list-group list-group-horizontal' style={{ position: 'sticky', height: '44px' }}>
            <NavLink exact to='/' title='All' className='list-group-item list-group-item-action flex-fill' activeClassName='active'>All</NavLink>
            <NavLink exact to='/sleep' title='Sleep' className='list-group-item list-group-item-action flex-fill' activeClassName='active'>Sleep</NavLink>
            <NavLink exact to='/relax' title='Relax' className='list-group-item list-group-item-action flex-fill' activeClassName='active'>Relax</NavLink>
            <NavLink exact to='/focus' title='Focus' className='list-group-item list-group-item-action flex-fill' activeClassName='active'>Focus</NavLink>
        </div>
    );
}