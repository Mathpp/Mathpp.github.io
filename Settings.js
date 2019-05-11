var config = [ 3, 6, '.', ',', ';' ];
var items = ["Grouplength","GroupAfter", "GroupSeperator","DecimalSeperator", "ListSeperator"];
function getSettings() {
    try {
        var settings = [];
        for (var i = 0; i < items.length; i++) {
            var val = localStorage.getItem(items[i]);
            if(val != null && val.length > 0) {
                if(i < 2) {
                    settings.push(Number.parseInt(val));
                } else {
                    settings.push(val);
                }
            } else {
                settings.push(config[i]);
            }
        }
        return settings;
    } catch (e) {
        return config;
    }
}
function loadSettings() {
    for (var i = 0; i < items.length; i++) {
        var key = items[i];
        var val;
        try {
            val = localStorage.getItem(key);
        } catch (e) {
            val = null;
        }
        document.getElementById(key).value = val != null && val.length > 0 ? val : config[i];
    }
}
function saveSettings() {
    try {
        for (var key in items) {
            localStorage.setItem(items[key], document.getElementById(items[key]).value);
        }
    } catch (e) {
        
    }
}