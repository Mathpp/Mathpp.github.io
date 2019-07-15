var Update = null;
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
        });
    });
    Update = function() {
        if(navigator.serviceWorker) {
            navigator.serviceWorker.controller.postMessage("update");
            navigator.serviceWorker.addEventListener("message", function(e) {
                if(e.data === "updated") {
                    alert("Updated Reloading");
                    location.reload();
                }
            });
        }
    };
} else {
    Update = function() {
        location.reload();
    }
}