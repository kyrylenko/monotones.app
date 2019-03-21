import soundIds from '../constants/soundIds';
import defaultValues from '../constants/defaultValues';

const n = (n) => n > 9 ? '' + n : '0' + n;

export const secToMin = (sec) => {
    const minutes = n(Math.floor((sec % (1000 * 60 * 60)) / 60));
    const seconds = n(Math.floor(sec % 60));

    return { minutes, seconds };
};

export const aggregateSounds = (reduxSounds = {}) => {
    const aggregate = Object.values(soundIds).map(x => {
        const setting = reduxSounds[x];
        const hasSetting = setting !== undefined;

        return {
            id: x,
            isPlay: hasSetting ? setting.isPlay : false,
            volume: hasSetting ? setting.volume : defaultValues.defaultVolume,
            isLoaded: hasSetting ? setting.isLoaded : false,
        };
    });

    return aggregate;
};