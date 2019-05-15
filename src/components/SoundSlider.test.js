import React from 'react';
import SoundSlider from './SoundSlider';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('SoundSlider test', () => {
    it('Should call playPauseVolume() on click', () => {
        const playPauseVolumeMock = jest.fn();

        const wrapper = shallow(<SoundSlider
            id={'campfire'}
            isGlobalPlay={true}
            isPlay={true}
            isLoaded={true}
            volume={1}
            title={'Sound title'}
            playPauseVolume={playPauseVolumeMock} />);
        //console.log(wrapper.instance());
        const soundIcon = wrapper.find('.sound-icon');
        
        expect(soundIcon).toHaveLength(1);

        soundIcon.simulate('click');

        expect(playPauseVolumeMock).toHaveBeenCalledTimes(1);
        expect(soundIcon.prop('style').opacity).toEqual(1);
    });
});