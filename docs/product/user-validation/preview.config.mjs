import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const cert = process.env.LT_VALIDATION_CERT;
const key = process.env.LT_VALIDATION_KEY;
if (Boolean(cert) !== Boolean(key)) {
  throw new Error('Indica LT_VALIDATION_CERT y LT_VALIDATION_KEY juntos.');
}

// Local validation only: never proxy test progress to a real account/API.
export default defineConfig({
  preview: {
    host: cert ? '0.0.0.0' : '127.0.0.1',
    port: 4178,
    strictPort: true,
    https: cert ? { cert: readFileSync(cert), key: readFileSync(key) } : undefined,
    proxy: {},
  },
  plugins: [{
    name: 'local-validation-without-sync',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0].startsWith('/api/')) {
          res.writeHead(401, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
          res.end(JSON.stringify({ error: 'authentication_required' }));
          return;
        }
        next();
      });
    },
  }],
});
