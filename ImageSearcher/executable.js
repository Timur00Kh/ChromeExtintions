window.addEventListener('mousedown', clicked, false);
var vid = {};

function clicked(el) {
    console.log(el.button);
    if (el.button !== 2) return;
    console.log(el);
    console.log(el.path[0].style.backgroundImage.indexOf("url"));
    if (el.target.nodeName == "IMG") {
        chrome.runtime.sendMessage({
            key: "img_searcher",
            type: "img",
            url: getFullURL(el.target.src)
        });
    } else if (el.target.nodeName == "VIDEO"){
        var d = el.target.getBoundingClientRect();
        console.log(d);
        vid = el.target;
        chrome.runtime.sendMessage({
            key: "img_searcher",
            type: "video",
            dimensions: d,
            window: {
                maxHeight: document.documentElement.clientHeight,
                maxWidth:  document.documentElement.clientWidth
            },
            src: el.target.src
        });
    } else {
        var p = el.path;
        for (var i = 0; i < 2; i++) {
            var backgroundImage = p[i].style.backgroundImage;
            if (backgroundImage && backgroundImage.indexOf("url") > -1){
                chrome.runtime.sendMessage({
                    key: "img_searcher",
                    type: "bg_img",
                    url: getFullURL(backgroundImage.substring(
                        backgroundImage.indexOf("(\"") + 2,
                        backgroundImage.indexOf("\")")
                    ))
                });
                return;
            }
            if (i >= p.length) break;
        }
        chrome.runtime.sendMessage({
            key: "img_searcher",
            type: "none"
        });
    }
}

function getFullURL(s) {
    b = document.createElement("a");
    b.href = s;
    return b.href
}

String.prototype.hashCode = function(){
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

/*Videoframe upMover*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request.src && request.src == vid.src) {
        vid.pause();
        var canvas = document.createElement("canvas");
        var d = getCoords(vid);
        canvas.width = d.width;
        canvas.height = d.height;
        var context = canvas.getContext("2d");
        context.drawImage(vid, 0, 0, d.width, d.height);
        appendCanvas(canvas);
        canvas.style.position = "absolute";
        canvas.style.zIndex = 99999;
        canvas.style.top = d.top + "px";
        canvas.style.left = d.left + "px";
        sendResponse("ok");
        console.log(canvas.toDataURL());
        /*setTimeout(function () {
            canvas.remove();
            vid = {};
        }, 5000);*/


        function appendCanvas(canvas) {
            if (document.webkitFullscreenElement) {
                document.webkitFullscreenElement.append(canvas);
            } else if (document.fullscreenElement) {
                document.fullscreenElement.append(canvas);
            } else if (document.mozFullScreenElement) {
                document.mozFullScreenElement.append(canvas);
            } else if (document.msFullscreenElement) {
                document.msFullscreenElement.append(canvas);
            } else {
                document.documentElement.append(canvas);
            }
        }
    }
});

function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
        width: box.width,
        height: box.height
    };
}
