import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Custom service worker: src/service-worker.ts (built to service-worker.js, the name existing clients know)
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      // Registration is done manually in src/registerServiceWorker.ts
      injectRegister: null,
      // public/manifest.json is used as is
      manifest: false,
      injectManifest: {
        globPatterns: ['**/*.{html,js,css,mp3,gif,svg,webp,png,ico}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  build: {
    // Same output folder as Create React App had
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
