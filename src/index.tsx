import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';

import { createAppStore } from './store';
import { loadingActions } from './store/loadingSlice';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import * as serviceWorker from './registerServiceWorker';

const baseUrl = document.querySelector('base')?.getAttribute('href') ?? '/';
const { persistor, store } = createAppStore();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename={baseUrl}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);

serviceWorker.register({
  onUpdateFound: () => store.dispatch(loadingActions.cachingStart()),
  onUpdate: () => store.dispatch(loadingActions.cachingEnd()),
  onSuccess: () => store.dispatch(loadingActions.cachingEnd()),
});
