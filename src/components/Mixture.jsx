import React from 'react';
import trash from '../assets/icons/delete.svg';

// `ref` is used by the list animation (MixAnim)
const Mixture = ({ ref, title, isActive, onPlay, onPause, onDelete }) => (
    <div
        ref={ref}
        title={isActive ? 'Pause mixture' : 'Play mixture'}
        onClick={isActive ? onPause : onPlay}
        className={`list-group-item d-flex justify-content-between align-items-center ${isActive ? 'active' : ''}`}>
        <span>{title}</span>
        <img onClick={onDelete} className='mixture-action-btn' src={trash} title='Delete mixture' alt='Delete mixture' />
    </div>
);

export default Mixture;
