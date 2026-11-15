## Monotones – sound equalizer for relaxing, productivity, and baby sleep.

[monotones.app](https://monotones.app) is a simple Progressive Web Application built with React.js

### Development

```sh
npm start          # dev server on http://localhost:3000
npm test           # unit and integration tests (Vitest, watch mode)
npm run lint       # ESLint
npm run typecheck  # TypeScript (app and service worker)
npm run build      # type check + production build to build/ (includes the service worker)
npm run preview    # serve the production build
```

### Structure

- `src/screens` – pages (the sound screen, About, Terms)
- `src/components` – UI components, they read the store with `useSelector`; no component library. The sound screen is the orbit (`Orbit`, `SoundOrb`: closer to the moon is louder), the sound tray (`SoundTray`, up to 6 sounds in a mix) and the dock (`Dock`); `Dialog` is a bottom sheet on phones
- `src/index.css` – design tokens (colours, fonts, spacing) of the single dark theme; fonts are self-hosted with Fontsource
- `src/hooks` – mobile layout, space key shortcut, sleep timer
- `src/store` – Redux Toolkit slices, selectors and thunks; state is saved to localStorage with redux-persist
- `src/sky` – the living night sky behind the orbit: star, ripple and wave physics (`sky.ts`, unit tested), canvas drawing (`draw.ts`), pointer, tilt and screen-turn input (`Sky.tsx`)
- `src/utils` – pure helpers (share links, sound catalogue, orbit geometry, time formatting)
- `src/i18n` – translations (English, Ukrainian)
- `src/audio` – sound players (mp3 files and sounds generated with Web Audio, like brown noise), volume handling (Web Audio fallback for iOS), sleep timer fade-out
- `src/seo.ts`, `src/prerender.tsx`, `scripts/prerender.mjs` – the indexable pages: `/`, one page per starter mix (`/mix/rainy-evening`, …), `/about`, `/terms`. `npm run build` renders each to static HTML with its own title, description and canonical URL (`build/mix/rainy-evening.html` is served at `/mix/rainy-evening`); `public/sitemap.xml` lists them. The former `/sleep`, `/relax`, `/focus` redirect to a mix page (`public/_redirects`)
- `src/service-worker.ts` – offline cache; serves audio byte ranges, which Safari requires
- `src/types` – shared TypeScript types
- `src/test` – test helpers; `src/App.test.tsx` covers the app end to end

### Browser notes

- Safari plays media from the service worker only with `206 Partial Content` responses, see `src/service-worker.ts`.
- iOS ignores `audio.volume`, so there the volume goes through a Web Audio gain node (`src/audio/volumeControl.ts`).
  Web Audio on iOS may pause when the screen locks or the app goes to the background.
