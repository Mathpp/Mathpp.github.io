var PREALPHACACHE_NAME = 'Math++v0.0';
var CACHE_NAME = 'Math++-V1';

self.addEventListener('install', function (event) {
    event.waitUntil(caches.has(PREALPHACACHE_NAME).then(function(hascache) {
        if(hascache) {
            return caches.delete(PREALPHACACHE_NAME);
        }
    }))
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
            event.waitUntil(
                caches.open(CACHE_NAME).then(function (cache) {
                    return cache.keys().then(function (keys) {
                        for (var key in keys) {
                            fetch(key, { cache: "reload" }).then(function (r) {
                                return caches.open(CACHE_NAME).then(function (c) {
                                    c.put(event.request, r);
                                });
                            })
                        }
                    })
                })
            );
            break;

        default:
            break;
    }
})
