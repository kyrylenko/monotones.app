import React from 'react';
import { render } from '@testing-library/react';
import About from './About';

it('About renders without crashing', () => {
    const { unmount } = render(<About />);
    unmount();
});
