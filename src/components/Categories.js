import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types'

const CategoriesWeb = (props) => {
    return (
        <div className='list-group' style={{ width: '80px', position: 'fixed', right: 0 }}>
            <NavLink exact to='/' title='All' className='list-group-item list-group-item-action' activeClassName='active'>All</NavLink>
            <NavLink exact to='/relax' title='Relax' className='list-group-item list-group-item-action' activeClassName='active'>Relax</NavLink>
            <NavLink exact to='/sleep' title='Sleep' className='list-group-item list-group-item-action' activeClassName='active'>Sleep</NavLink>
        </div>
    );
}

const CategoriesMobile = (props) => {
    return (
        <div className='list-group list-group-horizontal' style={{position: 'sticky'}}>
            <NavLink exact to='/' title='All' className='list-group-item flex-fill' activeClassName='active'>All</NavLink>
            <NavLink exact to='/relax' title='Relax' className='list-group-item flex-fill' activeClassName='active'>Relax</NavLink>
            <NavLink exact to='/sleep' title='Sleep' className='list-group-item flex-fill' activeClassName='active'>Sleep</NavLink>
        </div>
    );
}

const Categories = (props) => props.isMobile ? <CategoriesMobile {...props} /> : <CategoriesWeb {...props} />;

Categories.propTypes = {
    isMobile: PropTypes.bool.isRequired
}

export default Categories;