const CACHE_NAME = 'aurum-v5';
const ASSETS = [
  '/aurum-app/',
  '/aurum-app/index.html',
  '/aurum-app/admin.html',
  '/aurum-app/simulator.html',
  '/aurum-app/history.html',
  '/aurum-app/sectors.html',
  '/aurum-app/news.html',
  '/aurum-app/tutorial.html',
  '/aurum-app/help.html',
  '/aurum-app/assistant.html',
  '/aurum-app/options.html',
   '/aurum-app/report.html',
'/aurum-app/trading.html',
  '/aurum-app/manifest.json',
  '/aurum-app/icon-192.png',
  '/aurum-app/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
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
