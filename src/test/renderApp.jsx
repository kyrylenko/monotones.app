import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import i18n from '../i18n';
import { createAppStore } from '../store';
import App from '../App';

//Writes state the way redux-persist stores it (key 'persist:root', version 1)
export const seedPersistedState = (state) => {
    const serialized = Object.fromEntries(Object.entries(state).map(([k, v]) => [k, JSON.stringify(v)]));
    serialized._persist = JSON.stringify({ version: 1, rehydrated: true });
    localStorage.setItem('persist:root', JSON.stringify(serialized));
};

export const readPersistedState = () => {
    const raw = JSON.parse(localStorage.getItem('persist:root'));
    return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, JSON.parse(v)]));
};

//Sound ids currently playing through the mocked <audio> elements
export const playingSounds = () => [...window.__playing]
    .map(a => a.src.match(/\/([a-z_]+)(?:-[\w-]+)?\.mp3/)[1])
    .sort();

//Renders the whole application the same way src/index.jsx does
export const renderApp = async ({ path = '/', language = 'en-US' } = {}) => {
    await i18n.changeLanguage(language);
    const { store, persistor } = createAppStore();

    const utils = render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <MemoryRouter initialEntries={[path]}>
                    <App />
                </MemoryRouter>
            </PersistGate>
        </Provider>
    );
    //PersistGate renders nothing until the stored state is loaded, lazy chunks show a fallback
    await waitFor(() => {
        expect(document.querySelector('footer')).not.toBeNull();
        expect(document.body).not.toHaveTextContent('Loading...');
    });

    return { ...utils, store, persistor };
};
