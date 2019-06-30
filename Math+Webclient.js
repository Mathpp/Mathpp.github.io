var MQ = null;
var inputs = [];
var inputSpan = null;
var output = null;
var inputMathField = null;
var toggle = null;
var settings = getSettings();
var flow = [];
var lastnode = null;
var all = null;

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

    input = document.getElementById('input');
    if(typeof MathQuill !== 'undefined') {
        MQ = MathQuill.getInterface(2);
        inputMathField = MQ.MathField(input, {
            handlers: {
                enter: function() {
                    var enteredMath = inputMathField.latex();
                    addinputs(enteredMath);
                    invoke(enteredMath);
                }
            }
        });
        var switchinput = document.getElementById("switchinput");
        var area = inputMathField.__controller.textarea;
        var ctrlr = inputMathField.__controller;
        var root = ctrlr.root, cursor = ctrlr.cursor;
        var focus = function(e) {
            ctrlr.blurred = false;
            ctrlr.container.addClass('mq-focused');
            if (!cursor.parent)
                cursor.insAtRightEnd(root);
            if (cursor.selection) {
                cursor.selection.jQ.removeClass('mq-blur');
                ctrlr.selectionChanged(); //re-select textarea contents after tabbing away and back
            }
            else
                cursor.show();
        };
        var keypad = document.getElementById("keypad");
        switchinput.addEventListener("focus", function(e) {
            e.preventDefault();
            inputMathField.focus();
        }, true);
        switchinput.onchange = function(e) {
            e.preventDefault();
            if(e.target.checked) {
                inputMathField.__controller.textarea = $(keypad);
                area.off("blur");
                area[0].style.display = 'none';
                focus();
            } else {
                inputMathField.__controller.textarea = area;
                inputMathField.__controller.focusBlurEvents();
                area[0].style.display = '';
                inputMathField.focus();
            }
        }
        all = document.getElementById("all");
        all.onshow = [];
        radius = keypad.querySelectorAll('input[name="tab"]');
        radius.forEach(function(el) {
            el.onchange = function(e) {
                if(el.checked) {
                    if(typeof el.nextElementSibling !== "undefined" && typeof el.nextElementSibling.nextElementSibling !== "undefined" &&  typeof el.nextElementSibling.nextElementSibling.onshow !== "undefined") {
                        el.nextElementSibling.nextElementSibling.onshow.forEach(function(handler) {
                            setTimeout(handler);
                        });
                        el.nextElementSibling.nextElementSibling.onshow = [];
                    }
                }
            };
        });

    } else {
        alert("Error unsupported platform");
    }
    
    // Try load from storage
    loadTabs();
    if(tab1 != null) {
        var __Tab1 = document.querySelector("#__Tab1 ~ div");
        __Tab1.innerHTML = tab1;
    }
    if(tab2 != null) {
        var __Tab2 = document.querySelector("#__Tab2 ~ div");
        __Tab2.innerHTML = tab2;
    }
    
    // Setup invoke callbacks
    var nodes = document.querySelectorAll("input[type=\"radio\"] + label + div > button");
    for (var node of nodes) {
        setinvokeHandler(node, node.getAttribute("formula"), node.getAttribute("keystroke"));
    }

    var str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for(var i=0; i<str.length; i++) {
        var ch = str.charAt(i);
        var button = document.createElement('button');
        button.setAttribute('formula', ch);
        var line = document.createElement("div");
        button.appendChild(line);
        all.appendChild(button);
        line.classList.add("mathbtn");
        line.innerHTML = ch;
        setinvokeHandler(button, ch, null);
    }
    output = document.getElementById('output');
    output.mq = [];
    flow.push(output);
    toggle = document.getElementById('toggle');
}, false);

var addinputs = function() {
    inputs.push.apply(inputs, arguments);
    try{
        localStorage.setItem("inputs", JSON.stringify(inputs));
    } catch(e) {}
}

var worker = null;
if(navigator.userAgent == "webkitapp") {
    worker = [];
    worker.postMessage = function(message) {
        webkit.messageHandlers.webkitapp.postMessage(message);
    };
} else {
    worker = new Worker('worker.js');
}

worker.onerror = function(e) {
    if(flow.length > 1) {
        flow.length = 1;
    }
    output.appendChild(document.createTextNode("Failed: " + e.message));
    output.appendChild(document.createElement("br"));
    if(typeof output.parentElement.scrollTo !== "undefined") {
        output.parentElement.scrollTo(0,output.parentElement.scrollHeight);
    }
    updateProgress(1);
}

var lastid = 0;
var progressmax = 1;
var progresscur = 0;
var updateProgress = function(prog) {
    progresscur += prog;
    if(progresscur == progressmax) {
        progresscur = progressmax = 0;
    }
    setProgress(100 * (progressmax == 0 ? 1 : (progresscur / progressmax)));
}

loadState = function(inputs) {
    worker.postMessage({ type: "hidesteps" });
    inputs.forEach(function(input){
        if (input instanceof Array && input.length == config.length) {
            worker.postMessage({ type: "configure", "settings": input });
            worker.postMessage({ type: "hidesteps" });
        } else {
            invoke(input);
        }
    });
    // Restore Custom settings
    configure(settings);
    worker.postMessage({ type: "showsteps" });
}

var setinvokeHandler = function(button, formula, stroke) {
    button.onclick = function() {
        setTimeout(function() {
            if(formula != null) {
                inputMathField.write(formula);
            }
            if(stroke != null) {
                if(stroke == "Enter") {
                    var enteredMath = inputMathField.latex();
                    addinputs(enteredMath);
                    invoke(enteredMath);
                } else {
                    inputMathField.keystroke(stroke);
                }
            }
        });
    }
}

var appendMathButton = function (icon, formula, parameter, draggable) {
    var button = document.createElement(draggable ? 'div' : 'button');
    button.setAttribute('formula', formula);
    var keystroke = [];
    for(var i = 0; i < parameter; ++i) {
        keystroke.push("Left");
    }
    var stroke = keystroke.join(" ");
    button.setAttribute('keystroke', stroke);
    var line = document.createElement("div");
    button.appendChild(line);
    all.appendChild(button);
    line.classList.add("mathbtn");
    var onshow = function() {
        MQ.StaticMath(line, { mouseEvents:false }).latex(icon);
    };
    if(getComputedStyle(all).display === "none") {
        all.onshow.push(onshow);
    } else {
        onshow();
    }
    if(!draggable) {
        setinvokeHandler(button, formula, stroke);
    } else {
        button.draggable = true;
        button.classList.add("btn");
    }
}

var ConvertMathButton = function(draggable) {
    var nodes = document.querySelectorAll(!draggable ? "input[type=\"radio\"] + label + div > div[class=btn]" : "input[type=\"radio\"] + label + div > button");
    for (var node of nodes) {
        var button = document.createElement(draggable ? 'div' : 'button');
        var formula = node.getAttribute('formula');
        if(formula != null) {
            button.setAttribute('formula', formula);
        }
        var keystroke = node.getAttribute('keystroke');
        if(keystroke != null) {
            button.setAttribute('keystroke', keystroke);
        }
        for(var child of node.children) {
            button.appendChild(child);
        }
        button.style.gridArea = node.style.gridArea;
        node.parentNode.insertBefore(button, node);
        node.parentNode.removeChild(node);
        if(!draggable) {
            setinvokeHandler(button, formula, keystroke);
        } else {
            button.draggable = true;
            button.classList.add("btn");
        }
    }
    if(!draggable) {
        tab1 = document.querySelector("#__Tab1 ~ div").innerHTML;
        tab2 = document.querySelector("#__Tab2 ~ div").innerHTML;
        saveTabs();
    }
};

var editstate = false;
var lastReturnValue = null;

var printReturnValue = function() {
    if(lastReturnValue != null) {
        var line = document.createElement("span");
        flow[flow.length - 1].appendChild(line);
        var onshow = function() {
            var mathfield = MQ.StaticMath(line, { mouseEvents:true });
            output.mq.push(mathfield)
            mathfield.latex(onshow.lastReturnValue);
        };
        onshow.lastReturnValue = lastReturnValue;
        if(flow.length > 1) {
            flow[flow.length - 1].onshow.push(onshow);
        } else {
            onshow();
        }
        lastReturnValue = null;
    }
}

worker.onmessage = function(e) {
    switch (e.data.type) {
        case "loaded":
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
                addinputs.apply(null, ninputs);
            }
            break;
        case "success":
            printReturnValue();
            if(typeof output.parentElement.scrollTo !== "undefined") {
                output.parentElement.scrollTo(0,output.parentElement.scrollHeight);
            }
            flow.length = 1;
            updateProgress(1);
            break;
        case "ondefine":
            appendMathButton(e.data.label, e.data.formula, e.data.count, false);
        break;
    default:
        if(flow.length == 0) {
            setTimeout(function() {
                worker.onmessage(e)
            }, 200);
        } else {
            var text = e.data.data[1];
            var cmd = e.data.data[0];
            // Opens Subcalculation
            if(cmd == 0) {
                printReturnValue();
                var div = document.createElement("div");
                div.classList.add("__Subcalculation");
                flow[flow.length - 1].appendChild(div);
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                div.appendChild(checkbox);
                var label = document.createElement("label");
                label.htmlFor = checkbox.id = "__Subcalculation_" + (lastid++);
                var header = document.createElement("div");
                header.classList.add("__Subcalculation_header");
                var show = document.createElement("div");
                label.appendChild(show);
                show.innerHTML = ">";
                header.appendChild(label);
                if(text != null) {
                    var line = document.createElement("span");
                    header.appendChild(line);
                    var onshow = function() {
                        var mathfield = MQ.StaticMath(line, { mouseEvents:true });
                        output.mq.push(mathfield)
                        mathfield.latex(text);
                    };
                    if(flow.length > 1) {
                        flow[flow.length - 1].onshow.push(onshow);
                    } else {
                        setTimeout(onshow, 0);
                    }
                    lastReturnValue = null;
                }
                var content = document.createElement("div");
                content.classList.add("content");
                div.appendChild(content);
                div.appendChild(header);
                content.onshow = [];
                checkbox.onchange = function(e) {
                    if(checkbox.checked) {
                        content.onshow.forEach(function(handler) {
                            setTimeout(handler);
                        });
                        content.onshow = [];
                    }
                };
                flow.push(content);
            } else if(cmd == 1){
                if(text != null) {
                    printReturnValue();
                    lastReturnValue = text;
                }
                flow.pop();
            } else if(text != null) {
                var line = document.createElement("span");
                flow[flow.length - 1].appendChild(line);
                var onshow = function() {
                    var mathfield = MQ.StaticMath(line, { mouseEvents:true });
                    output.mq.push(mathfield)
                    mathfield.latex(text);
                };
                if(getComputedStyle(flow[flow.length - 1]).display === "none") {
                    flow[flow.length - 1].onshow.push(onshow);
                } else {
                    setTimeout(onshow, 0);
                }
                flow[flow.length - 1].appendChild(document.createElement("br"));
                if(typeof output.parentElement.scrollTo !== "undefined") {
                    output.parentElement.scrollTo(0,output.parentElement.scrollHeight);
                }
            } else {
                console.log("Failed(" + cmd + ")");
            }
        }
        break;
    }
};

var invoke = function(enteredMath) {
    if(toggle !== null) toggle.checked = false;
    updateProgress(0);
    progressmax++;
    worker.postMessage({ type: "invoke", expression: enteredMath });
};

var Reset = function() {
    if(toggle !== null) toggle.checked = false;
    inputs = [];
    worker.postMessage({ type: "reset" });
    while (all.lastElementChild) {
        all.removeChild(all.lastElementChild);
    }
};

var Clear = function() {
    if(toggle !== null) toggle.checked = false;
    while (output.lastElementChild) {
        output.removeChild(output.lastElementChild);
    }
};

var Import = function() {
    if(toggle !== null) toggle.checked = false;
    var exim = document.getElementById('ExportImport');
    if(exim.style.display == 'none') {
        exim.style.display = '';
    } else {
        var ninputs = JSON.parse(exim.value);
        loadState(ninputs);
        addinputs.apply(null, ninputs);
        exim.style.display = 'none';
    }
};
var Export = function() {
    if(toggle !== null) toggle.checked = false;
    var exim = document.getElementById('ExportImport');
    if(exim.style.display == 'none') {
        exim.style.display = '';
    }
    exim.value = JSON.stringify(inputs);
};

var configure = function(config) {
    addinputs(config);
    worker.postMessage({ type: "configure", "settings": config });
}

var LoadDefault = function() {
    configure(config);
    worker.postMessage({ type: "hidesteps" });
    // Load German Defaults
    if(toggle !== null) toggle.checked = false;
    return fetch("Default.Math++").then(function(r){
        return r.text().then(function(text) {
            var lines = text.split(/\r?\n/);
            addinputs.apply(addinputs, lines);
            lines.forEach(function(line) {
                invoke(line);
            });
            // Restore Custom settings
            configure(settings);
            worker.postMessage({ type: "showsteps" });
        });
    });
};
