const CACHE_NAME = 'aurum-v40';
const ASSETS = [
  '/aurum-app/',
  '/aurum-app/index.html',
  '/aurum-app/trading.html',
  '/aurum-app/brokerage.html',
  '/aurum-app/simulator.html',
  '/aurum-app/admin.html',
  '/aurum-app/assistant.html',
  '/aurum-app/sectors.html',
  '/aurum-app/news.html',
  '/aurum-app/history.html',
  '/aurum-app/options.html',
  '/aurum-app/report.html',
  '/aurum-app/ipo.html',
  '/aurum-app/tutorial.html',
  '/aurum-app/help.html',
  '/aurum-app/tickers.js',
  '/aurum-app/manifest.json',
  '/aurum-app/icon-192.png',
  '/aurum-app/icon-512.png'
];

// Install — pre-cache everything
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — delete old caches immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch — cache-first for HTML/JS/JSON, network-first for everything else
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isLocal = url.origin === self.location.origin;
  const isAsset = /\.(html|js|json|png|ico|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');

  if (isLocal && isAsset) {
    // Cache-first: serve from cache instantly, update in background
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          const fetchPromise = fetch(event.request).then(response => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => null);
          return cached || fetchPromise;
        })
      )
    );
  } else {
    // Network-first for external requests (Supabase, Claude API, fonts)
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
