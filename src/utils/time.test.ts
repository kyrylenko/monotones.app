import { secToMin } from './time';

describe('secToMin', () => {
    it.each([
        [0, '00', '00'],
        [59, '00', '59'],
        [600, '10', '00'],
        [620, '10', '20'],
        [3599, '59', '59'],
        [3600, '60', '00'],
    ])('%i sec is %s:%s', (sec, minutes, seconds) => {
        expect(secToMin(sec)).toEqual({ minutes, seconds });
    });
});
