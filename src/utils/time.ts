const pad = (n) => n > 9 ? `${n}` : `0${n}`;

// 620 => { minutes: '10', seconds: '20' }. Minutes do not wrap: 3600 => '60:00'
export const secToMin = (sec) => ({
    minutes: pad(Math.floor(sec / 60)),
    seconds: pad(Math.floor(sec % 60)),
});
