var MQ = null;
var inputs = [];
var inputSpan = null;
var output = null;
var inputMathField = null;
var inputMathFieldkeypad = null;
var inputMathFieldkeyboard = null;
var keypad = null;
var keyboard = null;
var toggle = null;
var settings = null;
var flow = [];
var lastnode = null;

var enter = function() {
    var enteredMath = inputMathField.latex();
    inputs.push(enteredMath);
    invoke(enteredMath);
}

var mqkeypad = {
    substituteTextarea : function(){
        var span = document.createElement("span");
        span.tabIndex = 0;
        return span;
    },
    handlers: {
        enter: enter
    }
};

var mqkeyboard = {
    handlers: {
        enter: enter
    }
};
var showhidemathkeypad = null;

var setProgress = null;

window.addEventListener('DOMContentLoaded', function() {
    var circle = document.querySelector('circle');
    var radius = circle.r.baseVal.value;
    var circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = (circumference  + " " + circumference);
    circle.style.strokeDashoffset = circumference;

    setProgress = function(percent) {
        const offset = circumference - percent / 100 * circumference;
        circle.style.strokeDashoffset = offset;
    }

    inputkeypad = document.getElementById('inputkeypad');
    inputkeyboard = document.getElementById('inputkeyboard');
    if(typeof MathQuill !== 'undefined') {
        MQ = MathQuill.getInterface(2);
        inputMathFieldkeypad = MQ.MathField(inputkeypad, mqkeypad);
        inputMathField = inputMathFieldkeyboard = MQ.MathField(inputkeyboard, mqkeyboard);
    } else {
        inputSpan.innerHTML = "Error unsupported platform";
    }
    flow.push(output = document.getElementById('output'));
    toggle = document.getElementById('toggle');
    settings = getSettings();
}, false);

showhidemathkeypad = function() {
    if(keyboard === null) {
        keyboard = document.getElementById('keyboard');
    }
    if(keypad === null) {
        keypad = document.getElementById('keypad');
    }
    if(keypad.style.display === 'none') {
        var old = inputMathFieldkeyboard.latex();
        keyboard.style.display = 'none';
        keypad.style.display = '';
        inputMathFieldkeypad.latex(old);
        inputMathField = inputMathFieldkeypad;
        window.scrollTo(0,document.body.scrollHeight);
    } else {
        var old = inputMathFieldkeypad.latex();
        keypad.style.display = 'none';
        keyboard.style.display = '';
        inputMathFieldkeyboard.latex(old);
        inputMathField = inputMathFieldkeyboard;
    }
}

// var worker = new Worker('worker.js');
var worker = new Worker('Math+Web.js');

worker.onerror = function(e) {
    if(flow.length > 1) {
        flow.length = 1;
    }
    output.appendChild(document.createTextNode("Failed: " + e.message));
    // flow[0].appendChild(document.createElement("br"));
    window.scrollTo(0,document.body.scrollHeight);
    updateProgress(1);
}

var lastid = 0;

var progressmax = 1;
var progresscur = 0;
var updateProgress = function(prog) {
    if(progresscur == progressmax) {
        progresscur = 0;
    }
    progresscur += prog;
    // progressmax -= prog;
    setProgress(100 * progresscur / progressmax);
}

loadState = function(inputs) {
    worker.postMessage([4]);
    inputs.forEach(function(input){
        if (input instanceof Array && input.length == config.length) {
            worker.postMessage([2, input]);
            worker.postMessage([4]);
        } else {
            invoke(input);
        }
    });
    worker.postMessage([3]);
}

worker.onmessage = function(e) {
    if(e.data[0] == -1) {
        updateProgress(1);
        var linput;
        try {
            linput = localStorage.getItem("inputs");
        } catch(e) {
            linput = null;
        }
        if (linput == null) {
            LoadDefault();
        } else {
            var ninputs = JSON.parse(linput);
            loadState(ninputs);
            inputs.push.apply(inputs, ninputs);
        }
    } else if(e.data[0] == -2) {
        if(1 < flow.length && lastnode != null){
            flow[0].appendChild(lastnode.cloneNode(true));
            // flow[0].appendChild(document.createElement("br"));
            lastnode = null;
        }
        flow.length = 1;
        updateProgress(1);
        window.scrollTo(0,document.body.scrollHeight);
    } else if(e.data[0] == -4) {
        // var cell = document.createElement("div");
        // document.getElementById("ngrid").appendChild(cell);
        var button = document.createElement('button');
        // button.setAttribute('onfocus', 'inputMathField.focus();');
        button.setAttribute('formula', e.data[2]);
        button.setAttribute('parameter', e.data[3].toString());
        var keystroke = [];
        for(var i = 0; i < e.data[3]; ++i) {
            keystroke.push("Left");
        }
        // button.setAttribute('onclick', 'wrttex(\'' + e.data[2].replace(/\\/g, "\\\\") + '\');inputMathField.keystroke(\'' + keystroke.join(" ") + '\')');
        // button.style = "pointer-events:none;";
        var line = document.createElement("div");
        button.appendChild(line);
        document.getElementById("ngrid")/* cell */.appendChild(button);
        line.classList.add("mathbtn");
        MQ.StaticMath(line, { mouseEvents:false }).latex(e.data[1]); 
        // button.appendChild(line);
        // katex.render(e.data[1], line, {
        //     throwOnError: false
        // });
        button.onfocus = function() {
            inputMathField.focus();
        };
        var keys = keystroke.join(" ");
        button.onclick = function() {
            wrttex(e.data[2]);
            inputMathField.keystroke(keys);
        }
    } else if(flow.length == 0) {
        setTimeout(worker.onmessage(e), 200);        
    } else {
        var text = e.data[1];
        var i = e.data[0];
        var show = null;
        if(i >= flow.length) {
            do {
                var div = document.createElement("div");
                flow[flow.length - 1].appendChild(div);
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                div.appendChild(checkbox);
                var label = document.createElement("label");
                label.htmlFor = checkbox.id = "collapsibledre" + (lastid++);
                show = document.createElement("div");
                label.appendChild(show);
                var hide = document.createElement("div");
                hide.innerText = "▼";
                label.appendChild(hide);
                div.appendChild(label);
                var content = document.createElement("div");
                content.classList.add("content");
                div.appendChild(content);
                flow.push(content);
            } while(i >= flow.length);
        } else if(i + 1 < flow.length && lastnode != null){
            flow[i].appendChild(lastnode.cloneNode(true));
            // flow[i].appendChild(document.createElement("br"));
        }
        flow.length = i + 1;
        var line = document.createElement("span");
        flow[i].appendChild(line);
        katex.render(text, line, {
            throwOnError: false
        });
        lastnode = line;
        if(show != null) {
            var line = document.createElement("span");
            line.classList.add("ncopy");
            // show.appendChild(line.cloneNode(true));
            katex.render(">" + text, line, {
                throwOnError: false
            });
            show.appendChild(line);
        }
        // flow[i].appendChild(document.createElement("br"));
        window.scrollTo(0,document.body.scrollHeight);
    }
};

var invoke = function(enteredMath) {
    if(toggle !== null) toggle.checked = false;
    updateProgress(0);
    progressmax++;
    worker.postMessage([0,enteredMath]);
};

var Reset = function() {
    if(toggle !== null) toggle.checked = false;
    inputs = [];
    worker.postMessage([1]);
};

var Clear = function() {
    if(toggle !== null) toggle.checked = false;
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
};

var Import = function() {
    if(toggle !== null) toggle.checked = false;
    var exim = document.getElementById('ExportImport');
    if(exim.style.display == 'none') {
        exim.style.display = 'initial';
    } else {
        var ninputs = JSON.parse(exim.value);
        loadState(ninputs);
        inputs.push.apply(inputs, ninputs);
        exim.style.display = 'none';
    }
};
var Export = function() {
    if(toggle !== null) toggle.checked = false;
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

var LoadDefault = function() {
    configure(config);
    worker.postMessage([4]);
    // Load German Defaults
    if(toggle !== null) toggle.checked = false;
    return fetch("Default.Math++").then(function(r){
        return r.text().then(function(text) {
            text.split(/\r?\n/).forEach(function(line) {
                inputs.push(line);
                invoke(line);
            });
            // Load Custom Settings
            worker.postMessage([3]);
        });
    });
};

onbeforeunload = function(e) {
    try{
        localStorage.setItem("inputs", JSON.stringify(inputs));
    } catch(e) {}
    inputs = null;
}

var wrttex = function(c) {
    inputMathField.focus();
    // inputMathField.typedText(c);
    inputMathField.write(c);
    window.scrollTo(0,document.body.scrollHeight);
}

var typetex = function(c) {
    inputMathField.focus();
    inputMathField.typedText(c);
    window.scrollTo(0,document.body.scrollHeight);
}

var cmdtex = function(c) {
    inputMathField.focus();
    inputMathField.cmd(c);
    window.scrollTo(0,document.body.scrollHeight);
}