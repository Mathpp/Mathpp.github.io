var CACHE_NAME = 'Math++-V1';
var urlsToCache = [
    '/index.html',
    '/Math++.css',
    '/InitWorker.js',
    '/Math+Web.js',
    '/Math+Web.wasm',
    '/Default.Math++',
    '/jquery.min.js',
    '/mathquill/mathquill.css',
    '/mathquill/mathquill.min.js',
    '/mathquill/fonts/Symbola.eot',
    '/mathquill/fonts/Symbola.svg',
    '/mathquill/fonts/Symbola.ttf',
    '/mathquill/fonts/Symbola.woff',
    '/mathquill/fonts/Symbola.woff2',
    '/katex/katex.min.css',
    '/katex/katex.min.js',
    '/katex/contrib/copy-tex.min.css',
    '/katex/contrib/copy-tex.min.js',
    '/katex/fonts/KaTeX_AMS-Regular.ttf',
    '/katex/fonts/KaTeX_AMS-Regular.woff',
    '/katex/fonts/KaTeX_AMS-Regular.woff2',
    '/katex/fonts/KaTeX_Caligraphic-Bold.ttf',
    '/katex/fonts/KaTeX_Caligraphic-Bold.woff',
    '/katex/fonts/KaTeX_Caligraphic-Bold.woff2',
    '/katex/fonts/KaTeX_Caligraphic-Regular.ttf',
    '/katex/fonts/KaTeX_Caligraphic-Regular.woff',
    '/katex/fonts/KaTeX_Caligraphic-Regular.woff2',
    '/katex/fonts/KaTeX_Fraktur-Bold.ttf',
    '/katex/fonts/KaTeX_Fraktur-Bold.woff',
    '/katex/fonts/KaTeX_Fraktur-Bold.woff2',
    '/katex/fonts/KaTeX_Fraktur-Regular.ttf',
    '/katex/fonts/KaTeX_Fraktur-Regular.woff',
    '/katex/fonts/KaTeX_Fraktur-Regular.woff2',
    '/katex/fonts/KaTeX_Main-Bold.ttf',
    '/katex/fonts/KaTeX_Main-Bold.woff',
    '/katex/fonts/KaTeX_Main-Bold.woff2',
    '/katex/fonts/KaTeX_Main-BoldItalic.ttf',
    '/katex/fonts/KaTeX_Main-BoldItalic.woff',
    '/katex/fonts/KaTeX_Main-BoldItalic.woff2',
    '/katex/fonts/KaTeX_Main-Italic.ttf',
    '/katex/fonts/KaTeX_Main-Italic.woff',
    '/katex/fonts/KaTeX_Main-Italic.woff2',
    '/katex/fonts/KaTeX_Main-Regular.ttf',
    '/katex/fonts/KaTeX_Main-Regular.woff',
    '/katex/fonts/KaTeX_Main-Regular.woff2',
    '/katex/fonts/KaTeX_Math-BoldItalic.ttf',
    '/katex/fonts/KaTeX_Math-BoldItalic.woff',
    '/katex/fonts/KaTeX_Math-BoldItalic.woff2',
    '/katex/fonts/KaTeX_Math-Italic.ttf',
    '/katex/fonts/KaTeX_Math-Italic.woff',
    '/katex/fonts/KaTeX_Math-Italic.woff2',
    '/katex/fonts/KaTeX_SansSerif-Bold.ttf',
    '/katex/fonts/KaTeX_SansSerif-Bold.woff',
    '/katex/fonts/KaTeX_SansSerif-Bold.woff2',
    '/katex/fonts/KaTeX_SansSerif-Italic.ttf',
    '/katex/fonts/KaTeX_SansSerif-Italic.woff',
    '/katex/fonts/KaTeX_SansSerif-Italic.woff2',
    '/katex/fonts/KaTeX_SansSerif-Regular.ttf',
    '/katex/fonts/KaTeX_SansSerif-Regular.woff',
    '/katex/fonts/KaTeX_SansSerif-Regular.woff2',
    '/katex/fonts/KaTeX_Script-Regular.ttf',
    '/katex/fonts/KaTeX_Script-Regular.woff',
    '/katex/fonts/KaTeX_Script-Regular.woff2',
    '/katex/fonts/KaTeX_Size1-Regular.ttf',
    '/katex/fonts/KaTeX_Size1-Regular.woff',
    '/katex/fonts/KaTeX_Size1-Regular.woff2',
    '/katex/fonts/KaTeX_Size2-Regular.ttf',
    '/katex/fonts/KaTeX_Size2-Regular.woff',
    '/katex/fonts/KaTeX_Size2-Regular.woff2',
    '/katex/fonts/KaTeX_Size3-Regular.ttf',
    '/katex/fonts/KaTeX_Size3-Regular.woff',
    '/katex/fonts/KaTeX_Size3-Regular.woff2',
    '/katex/fonts/KaTeX_Size4-Regular.ttf',
    '/katex/fonts/KaTeX_Size4-Regular.woff',
    '/katex/fonts/KaTeX_Size4-Regular.woff2',
    '/katex/fonts/KaTeX_Typewriter-Regular.ttf',
    '/katex/fonts/KaTeX_Typewriter-Regular.woff',
    '/katex/fonts/KaTeX_Typewriter-Regular.woff2',
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
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