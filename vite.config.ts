import { defineConfig } from 'vite';
import { releaseContentPlugin } from './scripts/release-vite-plugin';
export default defineConfig({
  base: process.env.LT_PAGES_BASE || '/',
  plugins: [releaseContentPlugin()],
  server: { proxy: { '/api': 'http://127.0.0.1:8787' } },
});
