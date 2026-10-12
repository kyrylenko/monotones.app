import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Registration is done manually in src/registerServiceWorker.js
      injectRegister: null,
      // public/manifest.json is used as is
      manifest: false,
      // Keep the CRA file name so already installed clients pick up the update
      filename: 'service-worker.js',
      workbox: {
        globPatterns: ['**/*.{html,js,css,mp3,gif,svg,webp,png,ico}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        clientsClaim: true,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/]+\.[^/]+$/],
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
