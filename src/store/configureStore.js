import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { createBlacklistFilter } from 'redux-persist-transform-filter';

import { mainReducer } from './mainReducer';
import { loadingReducer } from './loadingReducer';
import { timerReducer } from './timerReducer';
import migrations from './migrations';

const mainBlacklistFilter = createBlacklistFilter(
    'main',
    ['isGlobalPlay']
);
const timerBlacklistFilter = createBlacklistFilter(
    'timer',
    ['timerRun', 'interval']
);
const loadingBlacklistFilter = createBlacklistFilter(
    'loading',
    ['isCaching']
);

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    migrate: createMigrate(migrations, { debug: true }),
    transforms: [
        mainBlacklistFilter,
        timerBlacklistFilter,
        loadingBlacklistFilter
    ]
}

const reducers = {
    main: mainReducer,
    timer: timerReducer,
    loading: loadingReducer
};

const rootReducer = combineReducers({
    ...reducers,
    //routing: routerReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
    const store = createStore(persistedReducer)
    const persistor = persistStore(store)
    return { store, persistor }
}