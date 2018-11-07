var CACHE_NAME = 'Math++v0.0';
var urlsToCache = [
  '/index.html',
  '/Math++.js',
  '/Math+Web.js',
  '/Math+Web.wasm',
  '/Default.Math++',
  '/mathquill/mathquill.css',
  '/mathquill/mathquill.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});