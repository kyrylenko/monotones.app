import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Share from './Share';

describe('Share test', () => {
    it('Share builds a link from the playing sounds', async () => {
        const reduxSounds = {
            campfire: {
                isPlay: true,
                id: 'campfire',
                volume: 1
            }
        };
        render(<Share reduxSounds={reduxSounds} className='top-bar-item px-lg-5 px-4' />);

        fireEvent.click(screen.getByText('share'));

        expect(await screen.findByDisplayValue('https://monotones.app/share/ce')).toBeInTheDocument();
    });
});
