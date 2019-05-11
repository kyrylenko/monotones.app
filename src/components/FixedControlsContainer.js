import React from 'react';

const FixedControlsContainer = (props) => (
    <div className='container-fluid fixed-controlls' style={{ position: 'fixed' }}>
        <div className='row'>
            <div className='col-md-3'>
                {props.left}
            </div>
            <div className='col-md-3 ml-md-auto'>
                {props.right}
            </div>
        </div>
    </div>
);

export default FixedControlsContainer;