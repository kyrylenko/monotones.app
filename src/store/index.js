import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    persistStore, persistReducer, createMigrate,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { createBlacklistFilter } from 'redux-persist-transform-filter';

import { mainReducer } from './mainSlice';
import { timerReducer } from './timerSlice';
import { loadingReducer } from './loadingSlice';
import migrations from './migrations';

// Saved in localStorage under 'persist:root'. Changing keys or the version affects existing users.
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    migrate: createMigrate(migrations, { debug: false }),
    transforms: [
        createBlacklistFilter('main', ['isGlobalPlay']),
        createBlacklistFilter('timer', ['timerRun', 'interval']),
        createBlacklistFilter('loading', ['isCaching']),
    ],
};

const rootReducer = combineReducers({
    main: mainReducer,
    timer: timerReducer,
    loading: loadingReducer,
});

export const createAppStore = () => {
    const store = configureStore({
        reducer: persistReducer(persistConfig, rootReducer),
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    });
    const persistor = persistStore(store);

    return { store, persistor };
};
