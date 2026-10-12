import type { MigrationManifest } from 'redux-persist';

//ref: https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#createmigratemigrations-config
const migrations: MigrationManifest = {
    0: (state) => state,
    1: () => undefined, //actually, just reset the state
};

export default migrations;
