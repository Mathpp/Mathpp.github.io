var config = [ 3, 6, '.', ',', ';' ];
var tab1 = null;
var tab2 = null;
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

function loadTabs() {
    try {
        tab1 = localStorage.getItem("tab1");
        if(tab1.length == 0) tab1 = null;
        tab2 = localStorage.getItem("tab2");
        if(tab2.length == 0) tab2 = null;
    } catch (e) {
        tab1 = null;
        tab2 = null;
    }
}

function saveTabs() {
    if (tab1 != null) {
        localStorage.setItem("tab1", tab1);
    }
    if (tab2 != null) {
        localStorage.setItem("tab2", tab2);
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