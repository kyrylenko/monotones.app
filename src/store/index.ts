import { combineReducers, configureStore, type Reducer, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';
import {
    persistStore, persistReducer, createMigrate,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
    type PersistConfig,
} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { createBlacklistFilter } from 'redux-persist-transform-filter';

import { mainReducer } from './mainSlice';
import { timerReducer } from './timerSlice';
import { loadingReducer } from './loadingSlice';
import migrations from './migrations';

const rootReducer = combineReducers({
    main: mainReducer,
    timer: timerReducer,
    loading: loadingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Saved in localStorage under 'persist:root'. Changing keys or the version affects existing users.
const persistConfig: PersistConfig<RootState> = {
    key: 'root',
    storage,
    version: 2,
    migrate: createMigrate(migrations, { debug: false }),
    // Saved values are merged into the initial state, so fields that are not saved keep their defaults
    stateReconciler: autoMergeLevel2,
    transforms: [
        createBlacklistFilter('main', ['isGlobalPlay']),
        createBlacklistFilter('timer', ['timerRun', 'interval']),
        createBlacklistFilter('loading', ['isCaching']),
    ],
};

// redux-persist types predate Redux 5 and lose the state type, so it is restored here
const persistedReducer = persistReducer(persistConfig, rootReducer) as unknown as Reducer<RootState>;

export const createAppStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    });
    const persistor = persistStore(store);

    return { store, persistor };
};

export type AppStore = ReturnType<typeof createAppStore>['store'];
export type AppDispatch = AppStore['dispatch'];
export type AppThunk = ThunkAction<void, RootState, unknown, UnknownAction>;
