import { combineReducers, createStore } from 'redux';
//import { routerReducer } from 'react-router-redux';
//import { persistStore, persistCombineReducers, } from 'redux-persist';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import * as sounds from './sounds';
//import * as mixtures from './mixtures';

const persistConfig = {
    key: 'root',
    storage,
}

const reducers = {
    main: sounds.reducer,
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