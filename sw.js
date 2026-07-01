const CACHE_NAME = 'aurum-v62';
const STATIC_ASSETS = [
  '/aurum-app/tickers.js',
  '/aurum-app/manifest.json',
  '/aurum-app/icon-192.png',
  '/aurum-app/icon-512.png'
];

const HTML_PAGES = [
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
  '/aurum-app/help.html'
];

// Install — pre-cache static assets only
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
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

// Fetch strategy:
// HTML pages — network-first so updates always show immediately
// Static assets (icons, manifest, tickers.js) — cache-first for speed
// External requests (Supabase, APIs) — network-first with no cache fallback
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isLocal = url.origin === self.location.origin;
  const isHTML  = /\.(html)$/.test(url.pathname) || url.pathname.endsWith('/aurum-app/') || url.pathname === '/aurum-app/';
  const isStatic = /\.(js|json|png|ico|webmanifest)$/.test(url.pathname);

  if (isLocal && isHTML) {
    // Network-first for HTML — always get latest version
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else if (isLocal && isStatic) {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  } else {
    // Network-only for external APIs — never cache Supabase or API responses
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
