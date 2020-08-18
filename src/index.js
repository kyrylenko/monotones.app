import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import configureStore from './store/configureStore';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import * as serviceWorker from './registerServiceWorker';
import { actionCreators as loadingActions } from './store/loadingReducer';
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

const { persistor, store } = configureStore();

//navigator.connection.downlink - internet speed
const config = {
  onUpdate: (r) => {
    //console.log('sw updated: ', new Date());
    store.dispatch(loadingActions.cachingEnd());
  },
  onSuccess: (r) => store.dispatch(loadingActions.cachingEnd()),
  onUpdateFound: () => store.dispatch(loadingActions.cachingStart()),
};

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter basename={baseUrl}>
        <ErrorBoundary>
          <I18nextProvider i18n={i18n}>
            <App />
          </I18nextProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  rootElement);

serviceWorker.register(config);

