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
        const { sleep } = aggregateSounds();
        const { container } = render(<RowsView
            sounds={sleep}
            playPauseVolume={() => { }}
            isGlobalPlay={true} />);

        const rows = container.querySelectorAll('.sounds-row');
        expect(sleep).toHaveLength(9);
        expect(rows).toHaveLength(5);
        expect(rows[4].querySelectorAll('img.sound-icon')).toHaveLength(1);
        expect(container.querySelectorAll('img.sound-icon')).toHaveLength(9);
    });
});
