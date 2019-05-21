var PREALPHACACHE_NAME = 'Math++v0.0';
var CACHE_NAME = 'Math++-V1';
var urlsToCache = [
    'index.html',
    'index.css',
    'Settings.html',
    'Settings.css',
    'Settings.js',
    'swclient.js',
    'worker.js',
    'About.html',
    'Math++.css',
    'InitWorker.js',
    'dragndrop.js',
    'Math+Webclient.js',
    'emscripten/Math+Web.js',
    'emscripten/Math+Web.wasm',
    'Default.Math++',
    'jquery.min.js',
    'mathquill/mathquill.css',
    'mathquill/mathquill.js',
    'mathquill/fonts/Symbola.eot',
    'mathquill/fonts/Symbola.svg',
    'mathquill/fonts/Symbola.ttf',
    'mathquill/fonts/Symbola.woff',
    'mathquill/fonts/Symbola.woff2',
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(async function() {
        if(await caches.has(PREALPHACACHE_NAME)) {
            await caches.delete(PREALPHACACHE_NAME);
        }
        CACHE_NAME = await (await fetch("https://api.github.com/repos/mathpp/mathpp.github.io/commits/master", { headers: {
            "Accept": "application/vnd.github.VERSION.sha"
        } })).text();
        var cache = await caches.open(CACHE_NAME);
        await cache.delete();
        await cache.addAll(urlsToCache);
    });
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).catch(function(error){
            return caches.match(event.request);
        })
    );
});

self.addEventListener('message', function (event) {
    switch (event.data) {
        case 'update':
            event.waitUntil(
                caches.open(CACHE_NAME)
                    .then(function (cache) {
                        return cache.addAll(urlsToCache);
                    })
            );
            break;

        default:
            break;
    }
})