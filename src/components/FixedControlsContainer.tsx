import type { ReactNode } from 'react';

interface FixedControlsContainerProps {
    left: ReactNode;
    right: ReactNode;
}

const FixedControlsContainer = ({ left, right }: FixedControlsContainerProps) => (
    <div className='fixed-controlls'>
        <div className='side-panel'>
            {left}
        </div>
        <div className='side-panel'>
            {right}
        </div>
    </div>
);

export default FixedControlsContainer;
