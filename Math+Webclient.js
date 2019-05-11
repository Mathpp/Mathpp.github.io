var MQ = null;
var inputs = [];
var inputSpan = null;
var output = null;
var inputMathField = null;
var toggle = null;
var settings = null;
var init = function() {
    settings = getSettings();
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
                    var enteredMath = inputMathField.latex();
                    inputs.push(enteredMath);
                    invoke(enteredMath);
                }
            }
        });
    }
};

var worker = new Worker('/Math+Web.js');

var flow = [];
var lastid = 0;

loadState = function(inputs) {
    for (const input of inputs) {
        if (input instanceof Array && input.length == config.length) {
            worker.postMessage([2, input]);
        } else {
            invoke(input);
        }
    }
}

worker.onmessage = function(e) {
    if(e.data[0] == -1) {
        var linput = localStorage.getItem("inputs");
        if (linput == null) {
            LoadDefault();
        } else {
            var ninputs = JSON.parse(linput);
            loadState(ninputs);
            inputs.push(...ninputs);
        }
    } else if(flow.length == 0) {
        setTimeout(worker.onmessage(e), 200);
    }
    else {
        var text = e.data[1];
        var i = e.data[0];
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
        window.scrollTo(0,document.body.scrollHeight);
    }
};

var invoke = function(enteredMath) {
    toggle.checked = false;
    worker.postMessage([0,enteredMath]);
};

var Reset = function() {
    toggle.checked = false;
    inputs = [];
    worker.postMessage([1]);
};

var Clear = function() {
    toggle.checked = false;
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
};

var Import = function() {
    toggle.checked = false;
    var exim = document.getElementById('ExportImport');
    if(exim.style.display == 'none') {
        exim.style.display = 'initial';
    } else {
        var ninputs = JSON.parse(exim.value);
        loadState(ninputs);
        inputs.push(...ninputs);
        exim.style.display = 'none';
    }
};
var Export = function() {
    toggle.checked = false;
    var exim = document.getElementById('ExportImport');
    if(exim.style.display == 'none') {
        exim.style.display = 'initial';
    }
    exim.value=JSON.stringify(inputs);
};

var configure = function(config) {
    inputs.push(config);
    worker.postMessage([2, config]);
}

var LoadDefault = async function() {
    configure(config);
    // Load German Defaults
    toggle.checked = false;
    var r = await fetch("/Default.Math++");
    var text = await r.text();
    for(let line of text.split(/\r?\n/)) {
        inputs.push(line);
        invoke(line);
    }
    // Load Custom Settings
    configure(settings);
};

onbeforeunload = function(e) {
    localStorage.setItem("inputs", JSON.stringify(inputs));
    inputs = null;
}
