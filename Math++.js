if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
        });
    });
}
var inputs = "";
var ctx = null;
var ltx = null;
var initctx = function() {
    if(!ctx) {
        ctx = new Module.Context();
        ltx = new Module.LaTeXEnvironment();
        ctx.UseGermanNumber(ltx);
    }
};
var LoadDefault = async function() {
    var r = await fetch("/Default.Math++");
    var text = await r.text();
    initctx();
    for(let line of text.split(/\r?\n/)) {
        var des = ltx.DeSerialize(ctx,line);
        if(des) {
            var inv = des.AsInvocable();
            if(inv) {
                var r = inv.Invoke(ctx);
                if(r) {
                    console.log(r.toString(ctx));
                }
            }
        }
    }
    inputs += text;
};
var Reset = function() {
    ctx = null;
    inputs = '';
};
var Import = function() {
    var exim = document.getElementById('ExportImport');
    if(exim.style.display == 'none') {
        exim.style.display = 'initial';
    } else {
        var ninputs = exim.value;
        inputs += ninputs;
        initctx();
        for(let line of ninputs.split('\n')) {
            var d = ltx.DeSerialize(ctx,line);
            if(d) {
                var i = d.AsInvocable();
                if(i) {
                    var r = i.Invoke(ctx);
                    if(r) {
                        console.log(r.toString(ctx));
                    }
                }
            }
        }
        exim.style.display = 'none';
    }
};
var Export = function() {
    var exim = document.getElementById('ExportImport');
    if(exim.style.display == 'none') {
        exim.style.display = 'initial';
    }
    exim.value=inputs;
}
var enteredMath = "";
var inputMathField = null;
var _init = function() {
    if(Module.Context === "undefined" || Module.LaTeXEnvironment === "undefined") {
        setTimeout(_init, 100);
    } else {
        LoadDefault();
    }
};
var Module = { onRuntimeInitialized: _init};
var MathInit = function() {
    var inputSpan = document.getElementById('input');
    var output = document.getElementById('output');
    var MQ = MathQuill.getInterface(2);
    var append = function(obj) {
        var line = document.createElement("span");
        line.innerText = obj.toString(ctx);
        output.appendChild(line);
        MQ.StaticMath(line);
        output.appendChild(document.createElement("br"));
        window.scrollTo(0,document.body.scrollHeight);
    }
    inputMathField = MQ.MathField(inputSpan, {
        handlers: {
            edit: function() {
                enteredMath = inputMathField.latex(); // Get entered math in LaTeX format
            },
            enter: function() {
                initctx();
                if(inputs.length > 0) inputs += '\n';
                    inputs += enteredMath;
                    var expr = ltx.DeSerialize(ctx,enteredMath);
                    if(expr) {
                        append(expr);
                        var inv = expr.AsInvocable();
                        if(inv) {
                            res = inv.Invoke(ctx);
                            if(res) {
                                append(res;
                            }
                    }
                }
            }
        }
    });
}