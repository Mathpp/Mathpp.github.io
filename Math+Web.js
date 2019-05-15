var bmemory = new WebAssembly.Memory({ initial: 100 });
var ui32 = new Uint32Array(bmemory.buffer);
var getstring = function(ptr) {
    var builder = [];
    var c = ptr >> 2;
    while (ui32[c]) {
        builder.push(String.fromCharCode(ui32[c++]));
    }
    return builder.join("");
}
var environment = {
    env: {
        memory: bmemory, exp: Math.exp, pow: Math.pow, sqrt: Math.sqrt, log: Math.log, log2: Math.log2, log10: Math.log10, sin: Math.sin, cos: Math.cos, tan: Math.tan, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, asin: Math.asin, acos: Math.acos, atan: Math.atan, atan2: Math.atan2, asinh: Math.asinh, acosh: Math.acosh, atanh: Math.atanh,
        fmod: function (a, b) {
            return a % b;
        },
        PrintLine: function (a, b) {
            if (b != 0) {
                postMessage([a, getstring(b)]);
            }
        },
        OnDefine: function(wlabel, wwrite, depth) {
            var write = getstring(wwrite);
            postMessage([-4, getstring(wlabel), /* depth > 0 ?  */"\\formula{" + write.replaceAll("\t","\\parameter{}") + "}" /* : write */, depth]);
        }
    }
};
var configure = results => {
    var config = [3, 6, '.', ',', ';'];
    var configure = function () {
        results.instance.exports.Configure(cal, config[0], config[1], config[2].charCodeAt(0), config[3].charCodeAt(0), config[4].charCodeAt(0));
    };
    var initCalc = function () {
        if (!cal) {
            cal = results.instance.exports.CreateCalculator();
            configure();
        }
    };
    var cal = null;
    var invoke = function (value) {
        initCalc();
        var buf = results.instance.exports.malloc((value.length + 1) << 2);
        for (var i = 0; i < value.length; i++) {
            ui32[(buf >> 2) + i] = value.charCodeAt(i);
        }
        ui32[(buf >> 2) + value.length] = 0;
        results.instance.exports.Invoke(cal, buf);
        results.instance.exports.free(buf);
        postMessage([-2]);
    }
    onmessage = function (e) {
        switch (e.data[0]) {
            case 0:
                invoke(e.data[1]);
                break;
            case 1:
                // Reset Definitions
                results.instance.exports.DeleteCalculator(cal);
                cal = null;
                initCalc();
                break;
            case 2:
                // Configure
                config = e.data[1];
                initCalc();
                configure();
                break;
            case 3:
                initCalc();
                results.instance.exports.ShowSteps(cal);
                break;
            case 4:
                initCalc();
                results.instance.exports.HideSteps(cal);
                break;
            default:
                break;
        }
    }
    postMessage([-1]);
};
if(WebAssembly.instantiateStreaming === 'function') {
    WebAssembly.instantiateStreaming(fetch('Math+Web.wasm'), environment).then(configure);
} else {
    fetch('Math+Web.wasm')
        .then(response => {
            return response.arrayBuffer();
        })
        .then(buffer => {
            return WebAssembly.instantiate(buffer, environment);
        })
        .then(configure).catch(e => {
            postMessage([-3]);
        });
}