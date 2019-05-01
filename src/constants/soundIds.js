export const relax = {
    sy: 'summer_day',        
    kr: 'kitty_purr',
    ce: 'campfire',    
    rm: 'river_stream',    
    fm: 'farm',
    bs: 'blue_whales',
    ms: 'magic_chimes',
    ns: 'night_owls',
    pd: 'playground',
    sl: 'ship_hull',    
    sa: 'subway',
    ts: 'tropical_birds',    
    //paris_cafe: 'paris_cafe',
    //birds_in_park: 'birds_in_park',
};
export const sleep = {
    st: 'summer_night',
    on: 'october_rain',
    ht: 'heartbeat',
    vs: 'vinyl_cracks',
    wn: 'white_noise',
    pe: 'pink_noise',
    se: 'space_drone',
    ws: 'wind_chimes',
    //REASON:incorreact clock phase because trimmed sound
    //clock: 'clock',
    //crickets: 'crickets',
    //REASON: too big size
    //desert: 'desert',
};
export const focus = {
    tm: 'thunderstorm',
    in: 'inside_train',
    de: 'deep_space',
    sh: 'sailing_yacht',
    ct: 'city_street',
    gy: 'ghosty',
    tr: 'typewriter',
    kb: 'keyboard'
};

export const all = {
    ...relax,
    ...sleep,
    ...focus
};