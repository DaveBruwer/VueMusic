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
});
