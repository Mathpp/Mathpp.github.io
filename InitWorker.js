if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
        });
    });
}
var MQ = null;
var inputs = "";
var inputSpan = null;
var output = null;
var inputMathField = null;
var toggle = null;
var init = function() {
    inputSpan = document.getElementById('input');
    output = document.getElementById('output');
    toggle = document.getElementById("toggle");
    flow.push(output);
    if(typeof MathQuill !== 'undefined') {
        MQ = MathQuill.getInterface(2);
        inputMathField = MQ.MathField(inputSpan, {
            handlers: {
                edit: function() {
                    enteredMath = inputMathField.latex();
                },
                enter: function() {
                    if(inputs.length > 0) inputs += '\n';
                    var enteredMath = inputMathField.latex();
                    inputs += enteredMath;
                    invoke(enteredMath);
                }
            }
        });
    }
}
var worker = new Worker('/Math+Web.js');

var flow = [];
var lastid = 0;
worker.onmessage = function(e) {
    if(e.data[0] == -1) {
        LoadDefault();
    } else if(flow.length == 0) {
        setTimeout(worker.onmessage(e), 200);
    }
    else {
        var text = e.data[1];
        var i = e.data[0];
        // var escroll = document.body.scrollTop >= document.body.scrollHeight;
        var show = null;
        while(i >= flow.length) {
            var div = document.createElement("div");
            flow[flow.length - 1].appendChild(div);
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            div.appendChild(checkbox);
            var label = document.createElement("label");
            label.htmlFor = checkbox.id = "collapsibledre" + (lastid++);
            show = document.createElement("div");
            show.appendChild(document.createTextNode("Show Steps "));
            label.appendChild(show);
            var hide = document.createElement("div");
            hide.innerText = "Hide Steps";
            label.appendChild(hide);
            div.appendChild(label);
            var content = document.createElement("div");
            content.classList.add("content");
            div.appendChild(content);
            flow.push(content);
        }
        flow.length = i + 1;
        var line = document.createElement("span");
        flow[i].appendChild(line);
        katex.render(text, line, {
            throwOnError: false
        });
        if(show != null) {
            show.appendChild(line.cloneNode(true));
        }
        flow[i].appendChild(document.createElement("br"));
        /* if(escroll)  */window.scrollTo(0,document.body.scrollHeight);
    }
};

var invoke = function(enteredMath) {
    worker.postMessage([0,enteredMath]);
};

var Reset = function() {
    worker.postMessage([1]);
}

var Clear = function() {
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
}

var Import = function() {
    toggle.checked = false;
    var exim = document.getElementById('ExportImport');
    if(exim.style.display == 'none') {
        exim.style.display = 'initial';
    } else {
        var ninputs = exim.value;
        inputs += ninputs;
        for(let line of ninputs.split('\n')) {
            invoke(line);
        }
        exim.style.display = 'none';
    }
};
var Export = function() {
    toggle.checked = false;
    var exim = document.getElementById('ExportImport');
    if(exim.style.display == 'none') {
        exim.style.display = 'initial';
    }
    exim.value=inputs;
}

var LoadDefault = async function() {
    toggle.checked = false;
    var r = await fetch("/Default.Math++");
    var text = await r.text();
    for(let line of text.split(/\r?\n/)) {
        invoke(line);
    }
    inputs += text;
};

var Update = function() {
    if(navigator.serviceWorker) {
        navigator.serviceWorker.postMessage("update");
    }
}