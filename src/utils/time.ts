const pad = (n: number): string => n > 9 ? `${n}` : `0${n}`;

// 620 => { minutes: '10', seconds: '20' }. Minutes do not wrap: 3600 => '60:00'
export const secToMin = (sec: number): { minutes: string; seconds: string } => ({
    minutes: pad(Math.floor(sec / 60)),
    seconds: pad(Math.floor(sec % 60)),
});
