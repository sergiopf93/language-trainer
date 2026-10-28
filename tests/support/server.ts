import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import worker from '../../worker/index';
import { SqliteD1 } from './sqlite';
import { digest } from '../../shared/protocol';
const db = new SqliteD1();
db.sqlite.exec(await readFile('migrations/0001_foundation.sql', 'utf8'));
const assets = {
  async fetch(request: Request) {
    const path = new URL(request.url).pathname;
    // Match Cloudflare's canonical HTML redirect during release regression.
    if (process.env.E2E_RELEASE === '1' && path === '/index.html')
      return Response.redirect(new URL('/', request.url), 307);
    const target = resolve('dist', '.' + path);
    if (!target.startsWith(resolve('dist') + '/'))
      return new Response(await readFile('dist/index.html'), {
        headers: { 'Content-Type': 'text/html' },
      });
    const mime: Record<string, string> = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.html': 'text/html',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.webmanifest': 'application/manifest+json',
    };
    try {
      return new Response(await readFile(target), {
        headers: {
          'Content-Type': mime[extname(target)] ?? 'application/octet-stream',
        },
      });
    } catch {
      return new Response(await readFile('dist/index.html'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }
  },
};
const env = {
  DB: db.binding(),
  ASSETS: assets,
  OWNER_ID: '10000000-0000-4000-8000-000000000001',
  ACCESS_CODE_SHA256: await digest(
    process.env.E2E_ACCESS_CODE ?? 'local-test-only',
  ),
};
const server = createServer(async (req, res) => {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers))
      if (value)
        headers.set(key, Array.isArray(value) ? value.join(',') : value);
    const result = await worker.fetch(
      new Request('http://' + req.headers.host + req.url, {
        method: req.method,
        headers,
        body: ['GET', 'HEAD'].includes(req.method!)
          ? undefined
          : Buffer.concat(chunks).toString(),
      }),
      env,
    );
    res.writeHead(result.status, Object.fromEntries(result.headers));
    res.end(Buffer.from(await result.arrayBuffer()));
  } catch {
    res.writeHead(500);
    res.end('test_server_error');
  }
});
server.listen(8787, '127.0.0.1', () =>
  console.log(
    'Test-only Worker + SQLite server ready on http://localhost:8787',
  ),
);
process.on('SIGTERM', () =>
  server.close(() => {
    db.close();
    process.exit();
  }),
);
