import React from 'react';
import RowsView from './RowsView';
import renderer from 'react-test-renderer';
import { aggregateSounds } from '../utils/Utils';

describe('RowsView', () => {
    it('snapshot is correct', () => {
        const { relaxSounds } = aggregateSounds();
        const tree = renderer.create(<RowsView
            sounds={relaxSounds}
            playPauseVolume={() => { }}
            isGlobalPlay={true} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});