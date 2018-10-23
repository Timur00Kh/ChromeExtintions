var video, options, incStep, rewindStep, LargeRewindStep, hotkeys, started, canvasFontLink;

if (!started) {
    var box228container = document.createElement("div"),
        box228Canvas = document.createElement("canvas"),
        box228ctx = box228Canvas.getContext("2d"),
        fontLink = document.createElement("link");
    box228container.className = "box228container";
    box228Canvas.width = 200;
    box228Canvas.height = 100;
    box228container.append(box228Canvas);
    fontLink.href = canvasFontLink;
    fontLink.rel = "stylesheet";
    document.documentElement.append(fontLink);


    window.addEventListener("keydown", keydownController);
    window.addEventListener("keyup", keyupController);

    function keydownController(e) {
        if (!(e.altKey || e.ctrlKey || e.shiftKey)) return;
        makeAction(e);
    }

    function keyupController(e) {
        if (e.altKey || e.ctrlKey || e.shiftKey) return;
        makeAction(e);
    }

    function makeAction(ev) {
        var command = whatTheCommand(ev);
        var vid = video ? video : document.querySelector("VIDEO");
        if (!command || !vid) return;
        console.log(command);
        var rate = vid.playbackRate;
        switch (command) {
            case "speed_up":
                rate += incStep;
                if (rate > boundMax) rate = boundMax;
                break;
            case "slow_down":
                rate -= incStep;
                if (rate < boundMin) rate = boundMin;
                break;
            case "default_speed":
                rate = 1;
                break;
        }
        rate = Math.round(rate * 100) / 100;
        try {
            vid.playbackRate = rate;
            alertBox("Speed:<br>" + rate + "x");
        } catch (e) {
            console.log(e);
            alertBox("Reached max/min speed:<br>" + vid.playbackRate + "x");
        }
        var s;
        switch (command) {
            case "fast_forward":
                vid.currentTime += rewindStep;
                s = "+" + rewindStep;
                break;
            case "rewind":
                vid.currentTime -= rewindStep;
                s = "-" + rewindStep;
                break;
            case "l_fast_forward":
                vid.currentTime += LargeRewindStep;
                s = "+" + LargeRewindStep;
                break;
            case "l_rewind":
                vid.currentTime -= LargeRewindStep;
                s = "-" + LargeRewindStep;
                break;
        }
        if (s) {
            var t = vid.currentTime,
                time = [],
                ss = "";
            time.push((t - t % 3600) / 3600);
            t = t % 3600;
            time.push((t - t % 60) / 60);
            t = t % 60;
            time.push(Math.trunc(t));

            if (time[0] !== 0) ss += time[0] + ":";
            ss += (time[1].toString().length === 1 ? "0" : "") + time[1] + ":";
            ss += (time[2].toString().length === 1 ? "0" : "") + time[2];
            alertBox("Time: <br>" + ss + " (" + s + ")");
        }
        console.log(rate);
    }

    function whatTheCommand(k) {
        for (var c in hotkeys) {
            if (k.ctrlKey === hotkeys[c].ctrlKey)
                if (k.altKey === hotkeys[c].altKey)
                    if (k.shiftKey === hotkeys[c].shiftKey)
                        if (k.keyCode === hotkeys[c].keyCode)
                            return c;
        }
        return false;
    }

    function alertBox(s) {
        if (options.indication) return;
        box228ctx.clearRect(0, 0, box228ctx.width, box228ctx.height);
        box228ctx.strokeStyle = "rgb(68, 68, 68)";
        box228ctx.fillStyle = "rgba(0, 0, 0)";
        box228ctx.lineWidth = 1;
        roundRect(box228ctx, 5, 5, 185, 85, 5, true, true);
        box228ctx.font = "35px Google Sans";
        box228ctx.fillStyle = "White";
        box228ctx.textAlign = "center";
        box228ctx.fillText(s.split("<br>")[0], box228Canvas.width / 2, box228Canvas.height / 2 - 10);
        box228ctx.fillText(s.split("<br>")[1], box228Canvas.width / 2, box228Canvas.height / 2 + 25);

        var vid = video ? video : document.querySelector("VIDEO");
        vid.parentNode.append(box228container);
    }

    chrome.runtime.onMessage.addListener(function (v) {
        if (v === "egxit") {
            window.removeEventListener("keydown", keydownController);
            window.removeEventListener("keyup", keyupController);
        }
    });
    document.querySelectorAll("video").forEach(function (value, index, listObj) {
        value.addEventListener("click", function (e) {
            video = e.target;
            console.log(video);
        });
    });

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }

    }
}

function init() {
    chrome.runtime.sendMessage({type: "get"}, function (res) {
        console.log(res);
        options = res.options ? res.options : {};
        hotkeys = res.hotkeys;
        if (typeof options === "string") options = JSON.parse(options);
        if (typeof hotkeys === "string") hotkeys = JSON.parse(hotkeys);
        incStep = options.incStep ? options.incStep : 0.25;
        boundMin = options.boundMin ? options.boundMin : 0.25;
        boundMax = options.boundMax ? options.boundMax : 2;
        rewindStep = options.rewind_step ? options.rewind_step : 5;
        LargeRewindStep = options.l_rewind_step ? options.l_rewind_step : 10;
        canvasFontLink = res.font;
        started = true;
    });
}
init();