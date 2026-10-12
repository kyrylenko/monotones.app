/// <reference lib="webworker" />
import { cacheNames, clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { RangeRequestsPlugin } from 'workbox-range-requests';

declare let self: ServiceWorkerGlobalScope;

clientsClaim();
cleanupOutdatedCaches();

// Media elements request byte ranges. Safari only plays audio served by a service worker when such
// requests get "206 Partial Content", so the precached mp3 files are sliced here.
// Registered before precacheAndRoute() to take precedence over the plain precache route.
registerRoute(
    ({ url }) => url.pathname.endsWith('.mp3'),
    new CacheFirst({
        cacheName: cacheNames.precache,
        plugins: [new RangeRequestsPlugin()],
        matchOptions: { ignoreSearch: true, ignoreVary: true },
    }),
);

// App shell, icons and sounds (list injected at build time)
precacheAndRoute(self.__WB_MANIFEST);

// Single page app: unknown paths without a file extension get index.html
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [/^\/_/, /\/[^/]+\.[^/]+$/],
}));
