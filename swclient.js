var Update = null;
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
        });
    });
    navigator.serviceWorker.ready.then(function(registration) {
        var sw = navigator.serviceWorker;
        if (sw) {
            sw.addEventListener("message", function(e) {
                if (e.data === "updated") {
                    alert("Updated now reloading");
                    location.reload();
                }
            });
            Update = function() {
                sw.postMessage("update");
            };
        }
    });
} else {
    Update = function() {
        location.reload();
    }
}