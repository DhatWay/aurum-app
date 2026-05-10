const CACHE_NAME = 'aurum-v3';
const ASSETS = [
  '/aurum-app/',
  '/aurum-app/index.html',
  '/aurum-app/admin.html',
  '/aurum-app/simulator.html',
  '/aurum-app/history.html',
  '/aurum-app/sectors.html',
  '/aurum-app/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
