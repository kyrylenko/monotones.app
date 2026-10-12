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

    it('puts the last sound of an odd count on its own row', () => {
        const sounds = aggregateSounds().sleep.slice(0, 7);
        const { container } = render(<RowsView
            sounds={sounds}
            playPauseVolume={() => { }}
            isGlobalPlay={true} />);

        const rows = container.querySelectorAll('.sounds-row');
        expect(rows).toHaveLength(4);
        expect(rows[3].querySelectorAll('img.sound-icon')).toHaveLength(1);
        expect(container.querySelectorAll('img.sound-icon')).toHaveLength(7);
    });
});
