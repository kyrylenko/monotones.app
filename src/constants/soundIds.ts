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
} as const;
export const sleep = {
    st: 'summer_night',
    on: 'october_rain',
    ht: 'heartbeat',
    vs: 'vinyl_cracks',
    wn: 'white_noise',
    //REASON: replaced by brown noise, old 'pe' links open it (see utils/shareCode.ts)
    //pe: 'pink_noise',
    bn: 'brown_noise',
    se: 'space_drone',
    ws: 'wind_chimes',
    //REASON:incorreact clock phase because trimmed sound
    //clock: 'clock',
    //crickets: 'crickets',
    //REASON: too big size
    //desert: 'desert',
} as const;
export const focus = {
    tm: 'thunderstorm',
    in: 'inside_train',
    de: 'deep_space',
    sh: 'sailing_yacht',
    ct: 'city_street',
    gy: 'ghosty',
    tr: 'typewriter',
    kb: 'keyboard'
} as const;

export const all = {
    ...relax,
    ...sleep,
    ...focus
} as const;

// Order defines the "all sounds" page order
export const categories = { relax, sleep, focus } as const;

/** Two-letter code used in share links, e.g. 'ce' */
export type ShareCode = keyof typeof all;
/** Sound id, also the file name of its icon and mp3 (generated sounds have none), e.g. 'campfire' */
export type SoundId = (typeof all)[ShareCode];
export type Category = keyof typeof categories;

export const isShareCode = (code: string): code is ShareCode => code in all;
