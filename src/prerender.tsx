/* eslint-disable react-refresh/only-export-components -- a build-time entry, never hot reloaded */
// Build-time rendering of the indexable pages (see scripts/prerender.mjs), so their HTML has the real text and meta tags.
// It runs in Node: no PersistGate (nothing saved to restore) and the desktop layout, which lists every sound and mix.
// In the browser, src/index.tsx renders the app again over this markup.
import { prerender } from 'react-dom/static';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import i18n from './i18n';
import { createAppStore } from './store';
import App from './App';
import { pageMeta, PAGES } from './seo';

export { PAGES };

export const renderPage = async (path: string) => {
    await i18n.changeLanguage('en');
    const { store } = createAppStore();
    const { prelude } = await prerender(
        <Provider store={store}>
            <StaticRouter location={path}>
                <App />
            </StaticRouter>
        </Provider>,
    );
    const html = await new Response(prelude).text();
    return { html, ...pageMeta(path, i18n.t) };
};
