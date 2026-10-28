import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const base = process.env.LT_PAGES_BASE || '/';
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base))
  throw new Error('Invalid publication base');
const assets = [
  '/',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  ...(await readdir('dist/assets')).map((name) => '/assets/' + name),
];
// Cache the canonical root: static hosts can redirect /index.html to /.
// A redirected cached Response cannot satisfy a navigation with redirect=manual.
const hash = createHash('sha256').update('canonical-shell-v3' + base);
for (const asset of assets)
  hash.update(await readFile('dist' + (asset === '/' ? '/index.html' : asset)));
const prefix =
  'lt-shell-' + (base === '/' ? '' : base.slice(1).replaceAll('/', '-'));
const version = prefix + hash.digest('hex').slice(0, 16);
const manifest = JSON.parse(
  await readFile('dist/manifest.webmanifest', 'utf8'),
);
for (const key of ['id', 'start_url', 'scope']) manifest[key] = base;
for (const icon of manifest.icons)
  icon.src = base + icon.src.replace(/^\//, '');
await writeFile(
  'dist/manifest.webmanifest',
  JSON.stringify(manifest, null, 2) + '\n',
);
await writeFile('dist/.nojekyll', '');
await writeFile(
  'dist/sw.js',
  `const CACHE=${JSON.stringify(version)};const ASSETS=${JSON.stringify(assets.map((path) => base + path.slice(1)))};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(${JSON.stringify(prefix)})&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(${JSON.stringify(base)})||url.pathname.startsWith(${JSON.stringify(base + 'api/')}))return;
if(event.request.mode==='navigate'){event.respondWith(caches.open(CACHE).then(cache=>cache.match(${JSON.stringify(base)})).then(response=>response||fetch(event.request)));return;}
if(ASSETS.includes(url.pathname)){event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));}});
`,
);
