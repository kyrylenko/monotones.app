import { secToMin, aggregateSounds } from './Utils';

describe('secToMin tests', () => {
    it('600 sec is 10:00', () => {
        const actual = secToMin(600);

        expect(actual.minutes).toEqual('10');
        expect(actual.seconds).toEqual('00');
    });


    it('620 sec is 10:20', () => {
        const actual = secToMin(620);

        expect(actual.minutes).toEqual('10');
        expect(actual.seconds).toEqual('20');
    });

    it('0 sec is 00:00', () => {
        const actual = secToMin(0);

        expect(actual.minutes).toEqual('00');
        expect(actual.seconds).toEqual('00');
    });

    it('3599 sec is 59:59', () => {
        const actual = secToMin(3599);

        expect(actual.minutes).toEqual('59');
        expect(actual.seconds).toEqual('59');
    });
});

describe('aggregateSounds tests', () => {

    const reduxSounds = {
        campfire: {
            isPlay: true,
            id: 'campfire',
            volume: 1
        }
    };

    it('aggregateSounds returns 28 sounds', () => {
        const { relaxSounds, sleepSounds } = aggregateSounds();
        //console.log(actual);
        
        expect(relaxSounds.length + sleepSounds.length).toEqual(28);
    });

    it('isPlay depends on reduxSounds', () => {
        const { relaxSounds, sleepSounds } = aggregateSounds(reduxSounds);
        const actual = [...relaxSounds, ...sleepSounds];
        
        const summerNight = actual.find(x => x.id === 'summer_night');
        const campfire = actual.find(x => x.id === 'campfire');

        expect(summerNight.isPlay).toEqual(false);
        expect(campfire.isPlay).toEqual(true);
    });
});