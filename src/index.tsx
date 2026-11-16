// Self-hosted fonts (latin and cyrillic for Ukrainian), precached by the service worker for offline use
import '@fontsource/golos-text/latin-400.css';
import '@fontsource/golos-text/cyrillic-400.css';
import '@fontsource/golos-text/latin-500.css';
import '@fontsource/golos-text/cyrillic-500.css';
import '@fontsource/cormorant/latin-500-italic.css';
import '@fontsource/cormorant/cyrillic-500-italic.css';
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
