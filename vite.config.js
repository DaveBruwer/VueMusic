// vite.config.js

import { defineConfig } from '@vue/cli-service';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
    },
  })],
});
