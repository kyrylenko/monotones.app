import type { MigrationManifest, PersistedState } from 'redux-persist';
import type { Mixture, Sounds } from '../types';

// Moves the settings of a removed sound to the sound that replaced it
const replaceSound = (sounds: Record<string, unknown> | undefined, from: string, to: string): Sounds | undefined => {
    if (!sounds || !(from in sounds)) {
        return sounds as Sounds | undefined;
    }
    const { [from]: setting, ...rest } = sounds;
    return { ...rest, [to]: { ...(setting as object), id: to, isLoaded: false } } as Sounds;
};

type V1State = PersistedState & { main?: { sounds?: Sounds; mixtures?: Mixture[] } };

//ref: https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#createmigratemigrations-config
const migrations: MigrationManifest = {
    0: (state) => state,
    1: () => undefined, //actually, just reset the state
    //pink noise was replaced by brown noise
    2: (persisted) => {
        const state = persisted as V1State;
        if (!state?.main) {
            return state;
        }
        const { sounds, mixtures } = state.main;
        return {
            ...state,
            main: {
                ...state.main,
                sounds: replaceSound(sounds, 'pink_noise', 'brown_noise'),
                mixtures: mixtures?.map(m => ({ ...m, sounds: replaceSound(m.sounds, 'pink_noise', 'brown_noise')! })),
            },
        } as PersistedState;
    },
};

export default migrations;
