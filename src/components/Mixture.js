import React from 'react';
import colors from '../constants/colors';
import trash from '../assets/icons/trash.svg';

const Mixture = (props) => {
    return (
        <div style={{ marginTop: '5px' }} className='mixture-row row'>
            <div className='mixture-block mixture-block-selectable flex-container mixture-action-btn col-9 col-sm-9 col-md-9 col-lg-9'
                style={{ minHeight: '42px', justifyContent: 'center', backgroundColor: props.isActive ? colors.themeActive : colors.theme }}
                title={props.isActive ? 'Pause mixture' : 'Play mixture'}
                onClick={props.isActive ? () => props.deactivate() : () => props.switch(props.id)}>
                <span>{props.title}</span>
            </div>
            <div className='col-3 col-sm-3 col-md-3 col-lg-3'>
                <img onClick={() => props.delete(props.id)} className="mixture-img mixture-action-btn" src={trash} title='Delete mixture' alt='Delete mixture'></img>
            </div>
        </div>
    );
};

export default Mixture;