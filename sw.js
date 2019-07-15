var PREALPHACACHE_NAME = 'Math++v0.0';
var CACHE_NAME = 'Math++-V1';

self.addEventListener('install', function (event) {
    event.waitUntil(caches.has(PREALPHACACHE_NAME).then(function(hascache) {
        if(hascache) {
            return caches.delete(PREALPHACACHE_NAME);
        }
    }).then(caches.has(CACHE_NAME).then(function(hascache) {
        if(hascache) {
            return caches.delete(CACHE_NAME);
        }
    })).then(function() {
        return self.skipWaiting();
    }))
});

self.addEventListener('activate', function (event) {
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).then(function (r) {
            return caches.open(CACHE_NAME).then(function (c) {
                c.put(event.request, r.clone());
                return r;
            });
        }).catch(function () {
            return caches.match(event.request);
        })
    );
});

self.addEventListener('message', function (event) {
    switch (event.data) {
        case 'update':
            var cache = caches.open(CACHE_NAME);
            event.waitUntil(
                cache.then(function (cache) {
                    return cache.keys().then(function (keys) {
                        Promise.all(keys.map(function(url) {
                            return fetch(url, { cache: "no-store" }).then(function (r) {
                                cache.put(event.request, r);
                            })
                        })).then(function() {
                            postMessage("updated");
                        })
                    })
                })
            );
            break;

        default:
            break;
    }
})
