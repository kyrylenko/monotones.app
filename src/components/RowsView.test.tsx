import { render } from '@testing-library/react';
import RowsView from './RowsView';
import { aggregateSounds } from '../utils/sounds';

describe('RowsView', () => {
    it('snapshot is correct', () => {
        const { relax } = aggregateSounds();
        const { asFragment } = render(<RowsView
            sounds={relax}
            playPauseVolume={() => { }}
            isGlobalPlay={true} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
