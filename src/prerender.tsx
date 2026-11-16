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
import { LOCALIZED_PAGES, pageMeta, pathLanguage, stripLanguage } from './seo';
import { starterMixes, mixPath } from './constants/starterMixes';
import { mainActions } from './store/mainSlice';

export { LOCALIZED_PAGES as PAGES, pathLanguage };

export const renderPage = async (path: string) => {
    await i18n.changeLanguage(pathLanguage(path));
    const { store } = createAppStore();
    // A mix page shows its mix in the orbit (in the browser, App.tsx opens it on load)
    const mix = starterMixes.find(m => mixPath(m.id) === stripLanguage(path));
    if (mix) {
        store.dispatch(mainActions.openStarterMix(mix.id));
    }
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
