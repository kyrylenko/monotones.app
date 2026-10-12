import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Share from './Share';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() })

describe('Share test', () => {
    xit('Share works', () => {
        const reduxSounds = {
            campfire: {
                isPlay: true,
                id: 'campfire',
                volume: 1
            }
        };
        const wrapper = shallow(<Share reduxSounds={reduxSounds} className='top-bar-item px-lg-5 px-4' />);
        const actual = wrapper.instance().share();
    });
});