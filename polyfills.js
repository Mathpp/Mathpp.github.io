var importScript = function(src, then) {
    var script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    if(typeof then === 'function') {
        script.onload = then;
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}
if (typeof fetch !== 'function') {
    if (typeof Promise !== 'object') {
        importScript("polyfills/bluebird.js", function(){
            importScript("polyfills/fetch.umd.js");
        });
    } else {
        importScript("polyfills/fetch.umd.js");
    }
}