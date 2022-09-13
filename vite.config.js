<<<<<<< HEAD
// vite.config.js
// import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from '@vue/cli-service';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
    },
  })],
=======
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
const path = require('path');

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
>>>>>>> migrate_to_vite
});
