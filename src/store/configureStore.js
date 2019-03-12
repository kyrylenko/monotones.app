import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { createBlacklistFilter } from 'redux-persist-transform-filter';

import * as sounds from './sounds';
//import * as mixtures from './mixtures';

const mainBlacklistFilter = createBlacklistFilter(
    'main',
    ['isGlobalPlay']
);

const timerBlacklistFilter = createBlacklistFilter(
    'timer',
    ['timerRun']
);

const persistConfig = {
    key: 'root',
    storage,
    transforms: [
        mainBlacklistFilter,
        timerBlacklistFilter
    ]
}

const reducers = {
    main: sounds.reducer,
    timer: sounds.timerReducer
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