import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import App from './App';
import * as serviceWorker from './registerServiceWorker';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

const { persistor, store } = configureStore();
//navigator.connection.downlink - internet speed
const config = {
  onUpdate: function (r) {
    console.log('sw updated: ', new Date());
  },
  onSuccess: function (r) {
    console.log('sw success: ', new Date());
  },
  onUpdateFound: function () {
    console.log('sw update started: ', new Date());
  },
};

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter basename={baseUrl}>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  rootElement);

serviceWorker.register(config);

