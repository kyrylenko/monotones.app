import { render, fireEvent } from '@testing-library/react';
import SoundSlider from './SoundSlider';

describe('SoundSlider test', () => {
    it('Should call playPauseVolume() on click', () => {
        const playPauseVolumeMock = vi.fn();

        const { container } = render(<SoundSlider
            id={'campfire'}
            isGlobalPlay={true}
            isPlay={true}
            isLoaded={true}
            volume={1}
            title={'Sound title'}
            playPauseVolume={playPauseVolumeMock} />);
        const soundIcon = container.querySelectorAll('.sound-icon');

        expect(soundIcon).toHaveLength(1);

        fireEvent.click(soundIcon[0]);

        expect(playPauseVolumeMock).toHaveBeenCalledTimes(1);
        expect(soundIcon[0]).toHaveStyle({ opacity: '1' });
    });
});
