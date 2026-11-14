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

- `src/screens` – pages (sound board, About, Terms)
- `src/components` – UI components, they read the store with `useSelector`
- `src/hooks` – mobile layout, space key shortcut, sleep timer, light/dark theme (an inline script in `index.html` applies the theme before the first paint)
- `src/store` – Redux Toolkit slices, selectors and thunks; state is saved to localStorage with redux-persist
- `src/utils` – pure helpers (share links, sound catalogue, time formatting)
- `src/i18n` – translations (English, Ukrainian)
- `src/audio` – sound players: every sound (mp3 files and generated ones, like brown noise) loops seamlessly with Web Audio; loop preparation (silence trimming and crossfade at the loop point), volume, sleep timer fade-out
- `src/service-worker.ts` – offline cache; serves audio byte ranges, which Safari requires
- `src/types` – shared TypeScript types
- `src/test` – test helpers; `src/App.test.tsx` covers the app end to end

### Browser notes

- Sounds are decoded to PCM to loop without a gap: about 350 KB per second of audio while a sound plays (a 2 minute sound takes ~40 MB).
  The decoded audio is dropped on pause and decoded again on the next play.
- Volume goes through Web Audio gain nodes (`src/audio/volumeControl.ts`); `audio.volume` would not work on iOS anyway.
  Web Audio on iOS may pause when the screen locks or the app goes to the background.
- Safari plays media elements from the service worker only with `206 Partial Content` responses, see `src/service-worker.ts`.
