import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const temp = await mkdtemp(join(tmpdir(), 'lt-test-'));
await build({
  entryPoints: ['tests/support/server.ts'],
  outfile: join(temp, 'server.mjs'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
});
await import(pathToFileURL(join(temp, 'server.mjs')).href);
await rm(temp, { recursive: true });
