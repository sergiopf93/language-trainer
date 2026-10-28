import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const cert = process.env.LT_VALIDATION_CERT;
const key = process.env.LT_VALIDATION_KEY;
const host = process.env.LT_VALIDATION_HOST || '127.0.0.1';
if (['0.0.0.0', '::'].includes(host) || (host !== '127.0.0.1' && !cert)) {
  throw new Error(
    'Usa loopback o una IP privada concreta con certificado HTTPS.',
  );
}
if (Boolean(cert) !== Boolean(key)) {
  throw new Error('Indica LT_VALIDATION_CERT y LT_VALIDATION_KEY juntos.');
}

// Local validation only: never proxy test progress to a real account/API.
export default defineConfig({
  base: process.env.LT_PAGES_BASE || '/',
  preview: {
    host,
    port: 4178,
    strictPort: true,
    // Same-origin assets: avoid preview CORS Vary headers in the offline cache.
    cors: false,
    https: cert
      ? { cert: readFileSync(cert), key: readFileSync(key) }
      : undefined,
    proxy: {},
  },
  plugins: [
    {
      name: 'local-validation-without-sync',
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.split('?')[0].startsWith('/api/')) {
            res.writeHead(401, {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            });
            res.end(JSON.stringify({ error: 'authentication_required' }));
            return;
          }
          next();
        });
      },
    },
  ],
});
