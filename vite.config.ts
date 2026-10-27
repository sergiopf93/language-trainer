import { defineConfig } from 'vite';
import { releaseContentPlugin } from './scripts/release-vite-plugin';
export default defineConfig({
  plugins: [releaseContentPlugin()],
  server: { proxy: { '/api': 'http://127.0.0.1:8787' } },
});
