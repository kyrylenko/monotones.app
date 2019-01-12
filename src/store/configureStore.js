import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { createBlacklistFilter } from 'redux-persist-transform-filter';

import * as sounds from './sounds';
//import * as mixtures from './mixtures';

const saveSubsetBlacklistFilter = createBlacklistFilter(
    'main',
    ['isGlobalPlay']
);

const persistConfig = {
    key: 'root',
    storage,
    transforms: [
        saveSubsetBlacklistFilter
    ]
}

const reducers = {
    main: sounds.reducer,
    timer: sounds.timerReducer
    //Add the rest of reducers here:
    //weatherForecasts: mixtures.reducer
};

const rootReducer = combineReducers({
    ...reducers,
    //routing: routerReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
    let store = createStore(persistedReducer)
    let persistor = persistStore(store)
    return { store, persistor }
}