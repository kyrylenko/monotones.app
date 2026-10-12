## Monotones – sound equalizer for relaxing, productivity, and baby sleep.

[monotones.app](https://monotones.app) is a simple Progressive Web Application built with React.js

### Development

```sh
npm start        # dev server on http://localhost:3000
npm test         # unit and integration tests (Vitest, watch mode)
npm run lint     # ESLint
npm run build    # production build to build/ (includes the service worker)
npm run preview  # serve the production build
```

### Structure

- `src/screens` – pages (sound board, About, Terms)
- `src/components` – UI components, they read the store with `useSelector`
- `src/hooks` – mobile layout, space key shortcut, sleep timer
- `src/store` – Redux Toolkit slices, selectors and thunks; state is saved to localStorage with redux-persist
- `src/utils` – pure helpers (share links, sound catalogue, time formatting)
- `src/i18n` – translations (English, Ukrainian)
- `src/test` – test helpers; `src/App.test.jsx` covers the app end to end

### What is missing?

- Not supported by the Safari browser yet
