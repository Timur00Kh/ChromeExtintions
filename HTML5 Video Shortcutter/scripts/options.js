var options, incStep, rewindStep, LargeRewindStep, hotkeys;
function init() {
    options = localStorage.getItem("options") ? JSON.parse(localStorage.getItem("options")) : {};
    incStep = options.incStep ? options.incStep * 100 : 25;
    rewindStep = options.rewind_step ? options.rewind_step : 5;
    LargeRewindStep = options.l_rewind_step ? options.l_rewind_step : 10;
    hotkeys = localStorage.getItem("hotkeys") ? JSON.parse(localStorage.getItem("hotkeys")) : {};

    document.getElementById("incStep").value = incStep;
    document.getElementById("rewind_step").value = rewindStep;
    document.getElementById("l_rewind_step").value = LargeRewindStep;
    document.getElementById("indication").checked = !options.indication;
}
init();

document.getElementById("open_browser_shortcuts").addEventListener("click", function (ev) {
    chrome.tabs.query({active : true}, function(tab) {
        chrome.tabs.create({
            "url": "chrome://extensions/shortcuts",
            "index": ++tab[0].index
        });
    });
});




document.querySelectorAll(".stepper").forEach(function (value, index, listObj) {
    value.addEventListener("click", function (ev) {
         saveIncSteps()
    });
    value.addEventListener("keydown", function (e) {
         saveIncSteps();
    });
});

document.querySelectorAll("#hotkeys_holder input").forEach(function (value, index, listObj) {
    value.value = getKeyString(hotkeys[value.id]);
    value.addEventListener("keydown", function (e) {
        var currentInput = e.target;
        if (e.keyCode >= 32) {
            var newHotkey = {
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                key: e.key,
                keyCode: e.keyCode,
                code: e.code,
                which: e.which
            };
            for (var c in hotkeys) {
                if (currentInput.id != c) {
                    if (hotkeyComparator(hotkeys[c], newHotkey)) {
                        alert("Thats combination is already exist.   [ " + c + " ]");
                        return;
                    }
                }
            }
            currentInput.value = getKeyString(e);
            hotkeys[currentInput.id] = newHotkey;
            localStorage["hotkeys"] = JSON.stringify(hotkeys);
            currentInput.blur();
            currentInput = false;
        }

    })

});

function saveIncSteps() {
    setTimeout(function () {

        var g = document.getElementById("incStep").value;
        if (g >= 100) {
            options.incStep = 1;
        } else if (g < 10) {
            options.incStep = 0.1;
        } else {
            options.incStep = Number("0." + g);
        }

        g = document.getElementById("rewind_step").value;
        if (g >= 1000) {
            options.rewind_step = 1000;
        } else if (g < 1) {
            options.rewind_step = 1;
        } else {
            options.rewind_step = Number(g);
        }

        g = document.getElementById("l_rewind_step").value;
        if (g >= 1000) {
            options.l_rewind_step = 1000;
        } else if (g < 1) {
            options.l_rewind_step = 1;
        } else {
            options.l_rewind_step = Number(g);
        }

        console.log(options);
        localStorage["options"] = JSON.stringify(options);
    }, 200);
}

function getKeyString(k) {
    if (!k) return;
    var sArr = [],
        s = "";
    if (k.ctrlKey) sArr.push("Ctrl");
    if (k.altKey) sArr.push("Alt");
    if (k.shiftKey) sArr.push("Shift");
    if (k.keyCode > 32) sArr.push(k.key);
    if (k.keyCode === 32) sArr.push("Space");
    sArr.forEach(function (v, i, arr) {
        if (i === 0) {
            s += v;
        } else {
            s += " + " + v;
        }
    });
    return s
}

function hotkeyComparator(h1, h2) {
    if (h1.ctrlKey === h2.ctrlKey)
        if (h1.altKey === h2.altKey)
            if (h1.shiftKey === h2.shiftKey)
                if (h1.keyCode === h2.keyCode)
                    return true;
    return false;
}


/*RESET*/
document.getElementById("reset_all").addEventListener("click", function (ev) {
    if (confirm("Are you sure?")) {
        delete localStorage["options"];
        chrome.runtime.sendMessage({type:"init"}, function () {
            init();
            document.querySelectorAll("#hotkeys_holder input").forEach(function (value, index, listObj) {
                value.value = getKeyString(hotkeys[value.id]);
            });
            slider.noUiSlider.set([options.boundMin ? options.boundMin : 0.25, options.boundMax ? options.boundMax : 2]);
        });
    }
});

/*Slider*/
var slider = document.getElementById('slider');
noUiSlider.create(slider, {
    start: [0, 0],
    connect: true,
    tooltips: true,
    range: {
        'min': [0, 0.05],
        '20%': [1, 0.05],
        '40%': [2, 1],
        'max': [16]
    },
    pips: {
        mode: 'range',
        stepped: true,
        density: 5
    }
});
setTimeout(function () {
    slider.querySelector(".noUi-connect").style.backgroundColor = "#696969";
    slider.noUiSlider.set([options.boundMin ? options.boundMin : 0.25, options.boundMax ? options.boundMax : 2]);
    document.getElementById("indication").addEventListener("click", function (ev) {
        options["indication"] = !ev.target.checked;
        localStorage["options"] = JSON.stringify(options);
    });
}, 150);
slider.noUiSlider.on('change', function ( values, handle ) {
    console.log({
        val: values,
        handle: handle
    });
    if (values[0] > 1) values[0] = 1;
    if (values[1] <= 1) values[1] = 2;
    // if (values[0] === values[1]) values[1] = 2;
    slider.noUiSlider.set(values);
    options.boundMin = values[0];
    options.boundMax = values[1];
    localStorage["options"] = JSON.stringify(options);
});


/*FAQ*/
document.getElementById("faq1").addEventListener("click", function (ev) {
    chrome.tabs.create({
        "url": "chrome://extensions/shortcuts"
    });
});