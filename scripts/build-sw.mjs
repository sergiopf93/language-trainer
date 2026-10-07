import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const assets = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  ...(await readdir('dist/assets')).map((name) => '/assets/' + name),
];
const hash = createHash('sha256');
for (const asset of assets.filter((p) => p !== '/'))
  hash.update(await readFile('dist' + asset));
const version = 'lt-shell-' + hash.digest('hex').slice(0, 16);
await writeFile(
  'dist/sw.js',
  `const CACHE=${JSON.stringify(version)};const ASSETS=${JSON.stringify(assets)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('lt-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
if(event.request.mode==='navigate'){event.respondWith(caches.open(CACHE).then(cache=>cache.match('/index.html')).then(response=>response||fetch(event.request)));return;}
if(ASSETS.includes(url.pathname)){event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(event.request))||fetch(event.request)));}});
`,
);
