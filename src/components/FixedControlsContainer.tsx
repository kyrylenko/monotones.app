import type { ReactNode } from 'react';

interface FixedControlsContainerProps {
    left: ReactNode;
    right: ReactNode;
}

const FixedControlsContainer = ({ left, right }: FixedControlsContainerProps) => (
    <div className='container-fluid fixed-controlls mt-3' style={{ position: 'fixed' }}>
        <div className='row'>
            <div className='col-md-3'>
                {left}
            </div>
            <div className='col-md-3 ms-md-auto'>
                {right}
            </div>
        </div>
    </div>
);

export default FixedControlsContainer;
