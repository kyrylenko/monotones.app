import React from 'react';
import trash from '../assets/icons/delete.svg';

const Mixture = (props) => {
    return (
        <div
            title={props.isActive ? 'Pause mixture' : 'Play mixture'}
            onClick={props.isActive ? () => props.deactivate() : () => props.switch(props.id)}
            className={`list-group-item d-flex justify-content-between align-items-center ${props.isActive ? 'active' : ''}`}>
            <span>{props.title}</span>
            <img onClick={() => props.delete(props.id)} className='mixture-action-btn' src={trash} title='Delete mixture' alt='Delete mixture'></img>
        </div>
    );
};

export default Mixture;