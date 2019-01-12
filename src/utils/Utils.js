const n = (n) => n > 9 ? '' + n : '0' + n;

export const secToMin = (sec) => {
    const minutes = n(Math.floor((sec % (1000 * 60 * 60)) / 60));
    const seconds = n(Math.floor(sec % 60));

    return { minutes, seconds };
};