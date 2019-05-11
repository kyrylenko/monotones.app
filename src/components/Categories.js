import React from 'react';
import { NavLink } from 'react-router-dom';

export const CategoriesWeb = (props) => {
    return (
        <div className='list-group mx-auto' style={{ width: '80px'}}>
            <NavLink exact to='/' title='All' className='list-group-item list-group-item-action' activeClassName='active'>All</NavLink>
            <NavLink exact to='/sleep' title='Sleep' className='list-group-item list-group-item-action' activeClassName='active'>Sleep</NavLink>
            <NavLink exact to='/relax' title='Relax' className='list-group-item list-group-item-action' activeClassName='active'>Relax</NavLink>            
            <NavLink exact to='/focus' title='Focus' className='list-group-item list-group-item-action' activeClassName='active'>Focus</NavLink>
        </div>
    );
}

export const CategoriesMobile = (props) => {
    return (
        <div className='list-group list-group-horizontal' style={{position: 'sticky', height: '44px'}}>
            <NavLink exact to='/' title='All' className='list-group-item list-group-item-action flex-fill' activeClassName='active'>All</NavLink>
            <NavLink exact to='/sleep' title='Sleep' className='list-group-item list-group-item-action flex-fill' activeClassName='active'>Sleep</NavLink>
            <NavLink exact to='/relax' title='Relax' className='list-group-item list-group-item-action flex-fill' activeClassName='active'>Relax</NavLink>            
            <NavLink exact to='/focus' title='Focus' className='list-group-item list-group-item-action flex-fill' activeClassName='active'>Focus</NavLink>
        </div>
    );
}