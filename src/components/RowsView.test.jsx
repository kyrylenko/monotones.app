import React from 'react';
import { render } from '@testing-library/react';
import RowsView from './RowsView';
import { aggregateSounds } from '../utils/Utils';

describe('RowsView', () => {
    it('snapshot is correct', () => {
        const { relaxSounds } = aggregateSounds();
        const { asFragment } = render(<RowsView
            sounds={relaxSounds}
            playPauseVolume={() => { }}
            isGlobalPlay={true} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
