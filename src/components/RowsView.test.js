import React from 'react';
import RowsView from './RowsView';
import renderer from 'react-test-renderer';
import { aggregateSounds } from '../utils/Utils';

describe('RowsView test', () => {
    it('RowsView snapshot is correct', () => {
        const tree = renderer.create(<RowsView
            sounds={aggregateSounds()}
            playPauseVolume={() => { }}
            isGlobalPlay={true} />).toJSON();

        expect(tree).toMatchSnapshot();
    });
});