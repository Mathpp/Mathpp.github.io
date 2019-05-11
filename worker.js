if (typeof WebAssembly !== 'object') {
    if (!Array.from) {
        importScripts("polyfills/Array.from.js");
    }
    if (!Math.imul) {
        importScripts("polyfills/Math.imul.js");
    }
    if (!Math.fround) {
        importScripts("polyfills/Math.fround.js");
    }
    if(!Math.trunc) {
        importScripts("polyfills/Math.trunc.js");
    }
    // Must be loaded first
    importScripts("polyfills/wasm-polyfill.js");
}
if (typeof fetch !== 'function') {
    if (typeof Promise !== 'object') {
        importScripts("polyfills/bluebird.js");
    }
    importScripts("polyfills/fetch.umd.js");
}
importScripts("Math+Web.js");